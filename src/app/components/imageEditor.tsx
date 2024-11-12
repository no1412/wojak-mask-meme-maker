// components/ImageEditor.js

"use client";

import { useEffect, useRef, useState } from 'react';
import { fabric } from "fabric-pure-browser";

const ImageEditor = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [setUploadedImage] = useState(null);
  const fileInputRef = useRef(null); // 引入 file input 的引用

  // sticker list
  const stickers = [
    { src: '/1.png', alt: '1' },
    { src: '/2.png', alt: '2' },
    { src: '/3.png', alt: '3' },
  ];

  // generate sticker images
  const stickerImages = stickers.map((sticker, index) => (
    <img
      key={index} // for each img to add a unique key

      src={sticker.src}
      alt={sticker.alt}
      className="w-16 cursor-pointer border border-black"
      onClick={() => handleAddSticker(sticker.src)}
    />
  ));

  useEffect(() => {
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 400,
      height: 600,
    });
    setCanvas(fabricCanvas);

    

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (canvas) {
      canvasLoadImg(canvas, '/Wojak.jpg');
    }
  }, [canvas]);

  const handleUploadImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        fabric.Image.fromURL(reader.result, (img) => {
          const imgWidth = img.width;
          const imgHeight = img.height;
  
          // calculate the max width and height
          const maxWidth = 600;
          const maxHeight = 800;
  
          // calculate the scale factor
          const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
          const scaledWidth = imgWidth * scale;
          const scaledHeight = imgHeight * scale;
  
          // dynamically adjust canvas size to match image size
          canvas.setWidth(scaledWidth);
          canvas.setHeight(scaledHeight);
  
          // scale the image to fit the canvas
          img.scale(scale);
          img.set({
            left: 0,
            top: 0,
            originX: 'left',
            originY: 'top',
            selectable: false,
          });
  
          // set image as canvas background and render
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
        });
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const canvasLoadImg = (canvas1, url) => {
    fabric.Image.fromURL(url, (img) => {
      const imgWidth = img.width;
      const imgHeight = img.height;

      // calculate the max width and height
      const maxWidth = 600;
      const maxHeight = 800;

      // calculate the scale factor
      const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
      const scaledWidth = imgWidth * scale;
      const scaledHeight = imgHeight * scale;

      // dynamically adjust canvas size to match image size
      canvas1.setWidth(scaledWidth);
      canvas1.setHeight(scaledHeight);

      // scale the image to fit the canvas
      img.scale(scale);
      img.set({
        left: 0,
        top: 0,
        originX: 'left',
        originY: 'top',
        selectable: false,
      });

      // set image as canvas background and render
      canvas1.setBackgroundImage(img, canvas1.renderAll.bind(canvas1));
    });
  };
  

  const handleAddSticker = (stickerSrc) => {
    fabric.Image.fromURL(stickerSrc, (img) => {
      const stickerSize = 100; // initial sticker width (px)
      const scale = stickerSize / img.width;

      img.set({
        left: canvas.width / 2,
        top: canvas.height / 2,
        originX: 'center',
        originY: 'center',
        scaleX: scale,
        scaleY: scale,
      });
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
    });
  };

  const handleDeleteSticker = () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
      canvas.renderAll();
    }
  };

  const handleDownloadImage = () => {
    const dataURL = canvas.toDataURL({
      format: 'png',
      multiplier: 2,
    });
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'edited-image.png';
    link.click();
  };

  return (
    <div className="w-full flex flex-wrap p-4 items-">
      <div className="w-1/2 p-4  flex flex-col items-center border border-2 border-black">
        <canvas ref={canvasRef} className="w-full h-[400px]" />
      </div>

      {/* right sticker select area */}
      <div className="w-1/2 p-4 flex flex-col items-center border border-2 border-black">
        <p className="mb-2 text-2xl font-bold text-black font-bold">Stickers</p>
        <div className="flex flex-wrap">
          {stickerImages}
          {/* add more stickers */}
        </div>
        
        <div className="flex flex-row mt-4 items-center space-x-4">
          {/* hidden file upload input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUploadImage}
            className="hidden"
          />
          {/* customize upload btn */}
          <button
            onClick={() => fileInputRef.current.click()} // click emit file input
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-400 transition"
          >
            Upload Image
          </button>
          {/* remove sticker btn */}
          <button
            onClick={handleDeleteSticker}
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-400 transition">
            Remove Sticker
          </button>

          {/* download btn */}
          <button
            onClick={handleDownloadImage}
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-400 transition">
            Download Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
