export default function TripDetailSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header Section Skeleton */}
      <section className="relative w-full h-[80vh] bg-gray-200">
        <div className="absolute inset-0 flex flex-col items-center justify-center md:pb-[100px]">
          <div className="h-8 w-48 bg-gray-300 rounded mb-4"></div>
          <div className="h-16 w-3/4 bg-gray-300 rounded mb-4"></div>
          <div className="h-24 w-1/2 bg-gray-300 rounded mb-4"></div>
          <div className="h-8 w-48 bg-gray-300 rounded"></div>
        </div>
      </section>

      {/* Main Content Skeleton */}
      <section className="min-h-[75vh] md:flex items-center gap-4 p-6 md:p-12 md:px-20">
        <div className="md:w-[60%] w-full mb-5 md:mb-0">
          <div className="h-10 w-3/4 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
            <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="md:w-[40%] w-full">
          <div className="h-[500px] w-full bg-gray-200 rounded"></div>
        </div>
      </section>

      {/* Image Section Skeleton */}
      <section className="min-h-[75vh] w-full flex flex-col items-center justify-center shadow-md shadow-gray-200">
        <div className="w-full h-[300px] bg-gray-200"></div>
        <div className="flex flex-col items-center justify-center m-10 max-w-[700px] w-full">
          <div className="h-10 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4 w-full">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
            <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
          </div>
        </div>
      </section>

      {/* Price Section Skeleton */}
      <section className="p-6 sm:p-8 max-w-7xl mx-auto">
        <div className="h-20 w-full bg-gray-200 rounded mb-4"></div>
        <div className="h-20 w-full bg-gray-200 rounded"></div>
      </section>

      {/* Final Images Section Skeleton */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 sm:p-8 max-w-7xl mx-auto">
        <div className="h-[400px] w-full bg-gray-200 rounded"></div>
        <div className="h-[400px] w-full bg-gray-200 rounded"></div>
      </section>

      {/* WhatsApp Button Skeleton */}
      <div className="p-6 sm:p-8 max-w-7xl mx-auto">
        <div className="m-auto max-w-[400px] mt-10">
          <div className="h-12 w-full bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}
