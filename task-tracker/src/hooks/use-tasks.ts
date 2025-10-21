import { useQuery } from '@tanstack/react-query';

export function useTasks(sessionId?: string) {
  const { data, ...rest } = useQuery({
    queryKey: ['tasks', sessionId],
    queryFn: () => fetchTaskList(sessionId),
  });

  return {
    tasks: data,
    ...rest,
  };
}

async function fetchTaskList(sessionId?: string): Promise<Task[]> {
  if (!sessionId) return [];
  try {
    const response = await fetch('/tasks', {
      headers: {
        Authorization: `Bearer ${sessionId}`,
      },
    });
    const data = await response.json();
    return data.tasks;
  } catch {
    return [];
  }
}
