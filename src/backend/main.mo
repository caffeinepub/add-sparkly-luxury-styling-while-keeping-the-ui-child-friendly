import Int "mo:core/Int";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  module Day {
    public type Day = {
      #Monday;
      #Tuesday;
      #Wednesday;
      #Thursday;
      #Friday;
      #Saturday;
      #Sunday;
    };

    public func toInt(day : Day) : Nat {
      switch (day) {
        case (#Monday) { 0 };
        case (#Tuesday) { 1 };
        case (#Wednesday) { 2 };
        case (#Thursday) { 3 };
        case (#Friday) { 4 };
        case (#Saturday) { 5 };
        case (#Sunday) { 6 };
      };
    };

    public func compare(day1 : Day, day2 : Day) : Order.Order {
      Nat.compare(toInt(day1), toInt(day2));
    };
  };

  module TimeSlot {
    public type TimeSlot = {
      startHour : Nat;
      startMinute : Nat;
      endHour : Nat;
      endMinute : Nat;
    };

    public func compare(time1 : TimeSlot, time2 : TimeSlot) : Order.Order {
      switch (Nat.compare(time1.startHour, time2.startHour)) {
        case (#equal) {
          switch (Nat.compare(time1.startMinute, time2.startMinute)) {
            case (#equal) { #equal };
            case (other) { other };
          };
        };
        case (other) { other };
      };
    };
  };

  public type Homework = {
    id : Nat;
    title : Text;
    subject : Text;
    dueDate : Time.Time;
    notes : ?Text;
    completed : Bool;
  };

  public type TimetableEntry = {
    id : Nat;
    day : Day.Day;
    startTime : TimeSlot.TimeSlot;
    endTime : TimeSlot.TimeSlot;
    subject : Text;
    location : ?Text;
  };

  public type QuizProgress = {
    lastScore : Nat;
    bestScore : Nat;
    attemptsCount : Nat;
  };

  public type UserProfile = {
    name : Text;
  };

  var nextHomeworkId = 0;
  var nextTimetableId = 0;

  let assignments = Map.empty<Principal, Map.Map<Nat, Homework>>();
  let timetableEntries = Map.empty<Principal, Map.Map<Nat, TimetableEntry>>();
  let quizProgress = Map.empty<Principal, QuizProgress>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Homework management
  public shared ({ caller }) func addHomework(homework : Homework) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add homework");
    };
    let userHomework = switch (assignments.get(caller)) {
      case (?hw) { hw };
      case (null) {
        let newMap = Map.empty<Nat, Homework>();
        assignments.add(caller, newMap);
        newMap;
      };
    };
    let newId = nextHomeworkId;
    nextHomeworkId += 1;
    let newHomework : Homework = {
      homework with
      id = newId;
    };
    userHomework.add(newId, newHomework);
    newId;
  };

  public query ({ caller }) func getAllHomework() : async [Homework] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access homework");
    };
    switch (assignments.get(caller)) {
      case (?userHomework) { userHomework.values().toArray() };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func updateHomework(id : Nat, updatedHomework : Homework) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update homework");
    };
    switch (assignments.get(caller)) {
      case (?userHomework) {
        if (not userHomework.containsKey(id)) {
          Runtime.trap("Homework not found");
        };
        let newHomework : Homework = {
          updatedHomework with
          id;
        };
        userHomework.add(id, newHomework);
      };
      case (null) { Runtime.trap("Homework not found") };
    };
  };

  public shared ({ caller }) func deleteHomework(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete homework");
    };
    switch (assignments.get(caller)) {
      case (?userHomework) {
        if (not userHomework.containsKey(id)) {
          Runtime.trap("Homework not found");
        };
        userHomework.remove(id);
      };
      case (null) { Runtime.trap("Homework not found") };
    };
  };

  // Timetable management
  public shared ({ caller }) func addTimetableEntry(entry : TimetableEntry) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add timetable entries");
    };
    let userTimetable = switch (timetableEntries.get(caller)) {
      case (?entries) { entries };
      case (null) {
        let newMap = Map.empty<Nat, TimetableEntry>();
        timetableEntries.add(caller, newMap);
        newMap;
      };
    };
    let newId = nextTimetableId;
    nextTimetableId += 1;
    let newEntry : TimetableEntry = {
      entry with
      id = newId;
    };
    userTimetable.add(newId, newEntry);
    newId;
  };

  public query ({ caller }) func getAllTimetableEntries() : async [TimetableEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access timetable entries");
    };
    switch (timetableEntries.get(caller)) {
      case (?userTimetable) { userTimetable.values().toArray() };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func updateTimetableEntry(id : Nat, updatedEntry : TimetableEntry) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update timetable entries");
    };
    switch (timetableEntries.get(caller)) {
      case (?userTimetable) {
        if (not userTimetable.containsKey(id)) {
          Runtime.trap("Timetable entry not found");
        };
        let newEntry : TimetableEntry = {
          updatedEntry with
          id;
        };
        userTimetable.add(id, newEntry);
      };
      case (null) { Runtime.trap("Timetable entry not found") };
    };
  };

  public shared ({ caller }) func deleteTimetableEntry(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete timetable entries");
    };
    switch (timetableEntries.get(caller)) {
      case (?userTimetable) {
        if (not userTimetable.containsKey(id)) {
          Runtime.trap("Timetable entry not found");
        };
        userTimetable.remove(id);
      };
      case (null) { Runtime.trap("Timetable entry not found") };
    };
  };

  public query ({ caller }) func getTimetableEntriesByDay(day : Day.Day) : async [TimetableEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access timetable entries");
    };
    let entries = switch (timetableEntries.get(caller)) {
      case (?userTimetable) {
        userTimetable.values().filter(
          func(entry) {
            entry.day == day;
          }
        ).toArray();
      };
      case (null) { [] };
    };
    entries.sort(
      func(a, b) {
        TimeSlot.compare(a.startTime, b.startTime);
      }
    );
  };

  // Quiz Progress Management
  public query ({ caller }) func getQuizProgress() : async ?QuizProgress {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access quiz progress");
    };
    quizProgress.get(caller);
  };

  public shared ({ caller }) func saveQuizProgress(progress : QuizProgress) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save quiz progress");
    };
    quizProgress.add(caller, progress);
  };
};
