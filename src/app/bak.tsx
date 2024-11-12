// pages/index.js
"use client";

import React, { useState, useRef } from "react";
import { Stage, Layer, Image, Transformer } from "react-konva";
import useImage from "use-image";
import html2canvas from "html2canvas";

const URLImage = ({ image, isSelected, onSelect, onChange }) => {
  const [img] = useImage(image.src);
  const shapeRef = useRef();
  const transformerRef = useRef();

  React.useEffect(() => {
    if (isSelected) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <div>
      <Image
        alt="Uploaded Image"
        image={img}
        ref={shapeRef}
        x={image.x}
        y={image.y}
        width={image.width}
        height={image.height}
        rotation={image.rotation}
        draggable
        onClick={onSelect}
        onDragEnd={(e) => {
          onChange({
            ...image,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          onChange({
            ...image,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            width: node.width() * node.scaleX(),
            height: node.height() * node.scaleY(),
          });
          node.scaleX(1);
          node.scaleY(1);
        }}
      />
      {isSelected && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => newBox}
        />
      )}
    </div>
  );
};

export default function ImageEditor() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [stickers, setStickers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const editorRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => setUploadedImage(reader.result);
    reader.readAsDataURL(file);
  };

  const addSticker = (src) => {
    setStickers([
      ...stickers,
      { id: Date.now(), src, x: 50, y: 50, width: 100, height: 100, rotation: 0 },
    ]);
  };

  const handleDeselect = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }
  };

  const downloadImage = () => {
    if (!editorRef.current) return;
    html2canvas(editorRef.current).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "edited_image.png";
      link.click();
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <input type="file" onChange={handleImageUpload} />
        <button onClick={() => addSticker("/glasses.png")}>Add Glasses</button>
      </div>

      {uploadedImage && (
        <div
          ref={editorRef}
          className="relative mx-auto bg-gray-100 border rounded-lg"
          style={{ width: "500px", height: "500px" }}
        >
          <Stage
            width={500}
            height={500}
            onMouseDown={handleDeselect}
            onTouchStart={handleDeselect}
          >
            <Layer>
              <URLImage image={{ src: uploadedImage, x: 0, y: 0, width: 500, height: 500 }} />
              {stickers.map((sticker, i) => (
                <URLImage
                  key={sticker.id}
                  image={sticker}
                  isSelected={sticker.id === selectedId}
                  onSelect={() => setSelectedId(sticker.id)}
                  onChange={(newProps) => {
                    const newStickers = stickers.slice();
                    newStickers[i] = newProps;
                    setStickers(newStickers);
                  }}
                />
              ))}
            </Layer>
          </Stage>
        </div>
      )}

      {uploadedImage && (
        <button className="px-4 py-2 mt-4 text-white bg-blue-500 rounded" onClick={downloadImage}>
          Download Image
        </button>
      )}
    </div>
  );
}
