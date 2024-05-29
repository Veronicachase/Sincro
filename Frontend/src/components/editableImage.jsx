import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Image, Line } from 'react-konva';
import Modal from 'react-modal';
import { Button, Box } from '@mui/material';
import ExpandableImage from '../ui/CloudinaryImg';

Modal.setAppElement('#root'); // Establece el elemento raíz para accesibilidad

const EditableImage = ({ src, onSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const stageRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(src, { mode: 'cors' });
        const blob = await response.blob();
        const img = new window.Image();
        img.src = URL.createObjectURL(blob);
        img.onload = () => setImage(img);
      } catch (error) {
        console.error("Error fetching the image", error);
      }
    };

    fetchImage();
  }, [src]);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleSave = () => {
    const uri = stageRef.current.toDataURL();
    onSave(uri); // Callback para manejar la imagen guardada
    handleCloseModal();
  };

  return (
    <Box>
      <ExpandableImage
        uploadedImg={src}
        alt="Thumbnail"
        onClick={handleOpenModal}
        style={{ cursor: 'pointer', width: '150px', height: '100px', zIndex: "10" }}
      />
      <Modal isOpen={isOpen} onRequestClose={handleCloseModal} contentLabel="Edit Image">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Edit Image</h2>
          <Button variant="contained" onClick={handleCloseModal}>Close</Button>
        </Box>
        <Stage
          width={window.innerWidth * 0.8}
          height={window.innerHeight * 0.8}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          ref={stageRef}
        >
          <Layer>
            <Image image={image} ref={imageRef} />
            {lines.map((line, i) => (
              <Line key={i} points={line.points} stroke="red" strokeWidth={2} tension={0.5} lineCap="round" />
            ))}
          </Layer>
        </Stage>
        <Button variant="contained" onClick={handleSave} sx={{ marginTop: '1em' }}>Save</Button>
      </Modal>
    </Box>
  );
};

export default EditableImage;
