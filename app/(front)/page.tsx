import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-72px)] flex flex-col gap-y-10 content-center justify-center main-custom-background">
      <div className="px-[20%] flex flex-col justify-center content-center gap-7">
        <h1 className="text-6xl title-font text-center">Design subscription for teams that need speed and quality</h1>
        <div className="px-20">
          <h4 className="text-xl color-gray-500 subtitle-font text-center">Scale and delegate all your design operations quickly and easily, without the hassle of hiring or managing additional resources.</h4>
        </div>
      </div>
      <div className="flex justify-center gap-3 regular-font text-sm">
        <span>Graphic Design</span>
        <span>|</span>
        <span>Video Editing</span>
      </div>
      <div className="flex justify-center">
        <Link href='/register' className="grayola-button">Start Today</Link>
      </div>
    </div>
  );
}
