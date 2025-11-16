'use client';

import { lazy } from 'react';
import WithMoonLoader from '@/components/WithMoonLoader';

const Stats = lazy(() => import('@/components/Statistics'));
const StatsWithLoader = WithMoonLoader(Stats);

export default function StatsPage() {
    return <StatsWithLoader />;
}