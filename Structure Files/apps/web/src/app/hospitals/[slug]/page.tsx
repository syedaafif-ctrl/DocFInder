import HospitalDetailPage from '@/components/hospitals/HospitalDetailPage';

export default async function Page({ params }: any) {
  const slug = (await params).slug;

  return <HospitalDetailPage slug={slug} />;
}