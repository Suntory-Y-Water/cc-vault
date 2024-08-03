import Link from 'next/link';
import { Button } from './components/ui/button';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div>
        <h1>Home</h1>
        <Link href='/about'>About</Link>
        <Button>Click me</Button>
      </div>
    </main>
  );
}
