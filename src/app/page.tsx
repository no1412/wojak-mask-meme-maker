// pages/index.js
import ImageEditor from './components/imageEditor';

export default function Home() {
  return (
    <div className="min-h-screen p-4 bg-white">
      <h1 className="text-center text-7xl font-sans font-bold mt-5 mb-5 text-slate-800">Wojak Mask MEME Maker</h1>
      <ImageEditor />
    </div>
  );
}
