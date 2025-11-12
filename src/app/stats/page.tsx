import { lazy, Suspense } from 'react';
import { MoonLoader } from 'react-spinners';

const Stats = lazy(() => import('@/components/Stats'));

export default function StatsPage() {
    return (
        <Suspense fallback={<MoonLoader style={{ 'margin': '0 auto' }} />}>
            <Stats />
        </Suspense>
    )
}

