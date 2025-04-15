import { type ReactNode, Suspense } from 'react';

import Loading from '@/components/Common/Loading';

export default function Wrapper({ children }: { children: ReactNode }) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}
