import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Homework, TimetableEntry, QuizProgress, UserProfile, Day } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Homework Queries
export function useGetAllHomework() {
  const { actor, isFetching } = useActor();

  return useQuery<Homework[]>({
    queryKey: ['homework'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllHomework();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddHomework() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (homework: Omit<Homework, 'id'>) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addHomework({ ...homework, id: BigInt(0) } as Homework);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homework'] });
    },
  });
}

export function useUpdateHomework() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, homework }: { id: bigint; homework: Homework }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateHomework(id, homework);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homework'] });
    },
  });
}

export function useDeleteHomework() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteHomework(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homework'] });
    },
  });
}

// Timetable Queries
export function useGetAllTimetableEntries() {
  const { actor, isFetching } = useActor();

  return useQuery<TimetableEntry[]>({
    queryKey: ['timetable'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTimetableEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddTimetableEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: Omit<TimetableEntry, 'id'>) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addTimetableEntry({ ...entry, id: BigInt(0) } as TimetableEntry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetable'] });
    },
  });
}

export function useUpdateTimetableEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, entry }: { id: bigint; entry: TimetableEntry }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTimetableEntry(id, entry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetable'] });
    },
  });
}

export function useDeleteTimetableEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteTimetableEntry(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetable'] });
    },
  });
}

// Quiz Progress Queries
export function useGetQuizProgress() {
  const { actor, isFetching } = useActor();

  return useQuery<QuizProgress | null>({
    queryKey: ['quizProgress'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getQuizProgress();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveQuizProgress() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (progress: QuizProgress) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveQuizProgress(progress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizProgress'] });
    },
  });
}
