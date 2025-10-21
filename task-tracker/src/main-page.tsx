import { InputForm } from '@/components/input-form';
import { Task } from '@/components/task';
import { useTasks } from '@/hooks/use-tasks';
import { UserButton, useSession } from '@clerk/clerk-react';

export function MainPage() {
  const { session } = useSession();
  const { tasks, refetch } = useTasks(session?.id);

  return (
    <main>
      <div className='max-w-3xl mx-auto'>
        <header className='py-4'>
          <div className='flex items-center justify-between mb-4'>
            <h1 className='font-extrabold text-2xl'>Task Tracker</h1>
            <UserButton />
          </div>
          <InputForm sessionId={session?.id} refresh={refetch} />
        </header>
        <div className='divide-y-4'>
          {tasks?.map((task) => (
            <Task
              key={task.id}
              data={task}
              sessionId={session?.id}
              refresh={refetch}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
