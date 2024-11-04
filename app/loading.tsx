import { Card, CardContent } from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';

export default function LoadingPage() {
  return (
    <Card className="max-w-lg mx-auto mt-20">
      <CardContent className="flex flex-col items-center justify-center p-8">
        <Loading size={40} text="Načítání aplikace..." />
      </CardContent>
    </Card>
  );
} 