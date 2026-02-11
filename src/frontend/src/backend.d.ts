import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface QuizProgress {
    attemptsCount: bigint;
    bestScore: bigint;
    lastScore: bigint;
}
export interface TimeSlot {
    endHour: bigint;
    endMinute: bigint;
    startMinute: bigint;
    startHour: bigint;
}
export type Time = bigint;
export interface TimetableEntry {
    id: bigint;
    day: Day;
    startTime: TimeSlot;
    subject: string;
    endTime: TimeSlot;
    location?: string;
}
export interface Homework {
    id: bigint;
    title: string;
    subject: string;
    completed: boolean;
    dueDate: Time;
    notes?: string;
}
export interface UserProfile {
    name: string;
}
export enum Day {
    Saturday = "Saturday",
    Thursday = "Thursday",
    Sunday = "Sunday",
    Tuesday = "Tuesday",
    Friday = "Friday",
    Wednesday = "Wednesday",
    Monday = "Monday"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addHomework(homework: Homework): Promise<bigint>;
    addTimetableEntry(entry: TimetableEntry): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteHomework(id: bigint): Promise<void>;
    deleteTimetableEntry(id: bigint): Promise<void>;
    getAllHomework(): Promise<Array<Homework>>;
    getAllTimetableEntries(): Promise<Array<TimetableEntry>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getQuizProgress(): Promise<QuizProgress | null>;
    getTimetableEntriesByDay(day: Day): Promise<Array<TimetableEntry>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveQuizProgress(progress: QuizProgress): Promise<void>;
    updateHomework(id: bigint, updatedHomework: Homework): Promise<void>;
    updateTimetableEntry(id: bigint, updatedEntry: TimetableEntry): Promise<void>;
}
