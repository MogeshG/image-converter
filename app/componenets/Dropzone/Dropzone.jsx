'use client';
import Image from 'next/image';
import { Select } from '@geist-ui/react';
import React, { useEffect, useState } from 'react';
import Message from '../Message';
// import { message } from 'antd';
import { useDropzone } from 'react-dropzone';

const DropzoneComponent = () => {
  const [files, setFiles] = useState([]);
  const [targetTypes, setTargetTypes] = useState([]);
  const [results, setResults] = useState([]);
  const [errors, setErrors] = useState(false);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const existingFiles = files;
      existingFiles.push(...acceptedFiles);
      const types = targetTypes;
      existingFiles.forEach((_, index) => {
        types[index] = types[index] ? types[index] : '';
      });
      setFiles(existingFiles);
    },
  });

  useEffect(() => {
    setErrors(false);
  }, [files]);

  const filePreviews = files.map((file) => ({
    preview: URL.createObjectURL(file),
    name: file.name,
  }));

  const handleDelete = (i) => {
    const filteredFiles = files.filter((_, index) => index !== i);
    const types = targetTypes.filter((_, index) => index !== i);
    const newResults = results.filter((_, index) => index !== i);
    setFiles(filteredFiles);
    setResults(newResults);
    setTargetTypes(types);
  };

  const handleType = (i, val) => {
    const types = targetTypes;
    types[i] = val;
    setTargetTypes(types);
  };

  const handleAllType = (val) => {
    const types = targetTypes.map((type) => val);
    setTargetTypes(types);
  };

  const handleConvert = async () => {
    setResults([]);
    setErrors(false);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    targetTypes.forEach((type) => {
      formData.append('types', type);
    });

    try {
      const response = await fetch('/api/convert-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to convert image');
      }

      const data = await response.json();
      setResults(data);
      // Message.success({ text: 'Images converted successfully', duration: 2 });
    } catch (err) {
      console.log(err);
      // Message.error({ text: 'Unable to delete the image', duration: 2 });
      setErrors(true);
      // message.error({ content: 'Unable to convert the image' });
    }
  };

  const handleDownload = () => {
    results.forEach((base64Image, index) => {
      const byteCharacters = atob(base64Image);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const byteArray = new Uint8Array(
          Math.min(1024, byteCharacters.length - offset)
        );
        for (let i = 0; i < byteArray.length; i++) {
          byteArray[i] = byteCharacters.charCodeAt(offset + i);
        }
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, {
        type: `image/${targetTypes[index]}`,
      });

      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `converted-image-${index + 1}.${targetTypes[index]}`;
      link.click();

      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="w-[100%] flex flex-col items-center gap-6 justify-center">
      <div
        {...getRootProps()}
        className="flex border-2 shadow-md border-black h-[20vh] items-center bg-gray-200 rounded-md border-dashed w-[80%] justify-center"
      >
        <input {...getInputProps()} />
        <p className="text-center text-black">
          Drag & drop some files here, or click to select files
        </p>
      </div>
      {files.length > 0 && (
        <div className="w-[80%] flex justify-end">
          <div className="flex gap-3">
            <Select
              placeholder="format"
              size="small"
              style={{ minWidth: 'fit-content', width: '10rem' }}
              onChange={(value) => handleAllType(value)}
            >
              <Select.Option value="jpeg">JPEG (.jpeg)</Select.Option>
              <Select.Option value="png">PNG (.png)</Select.Option>
              <Select.Option value="gif">GIF (.gif)</Select.Option>
              <Select.Option value="webp">WEBP (.webp)</Select.Option>
              {/* <Select.Option value="bmp">BMP (.bmp)</Select.Option> */}
              <Select.Option value="tiff">TIFF (.tiff)</Select.Option>
              {/* <Select.Option value="svg">SVG (.svg)</Select.Option> */}
              {/* <Select.Option value="ico">ICO (.ico)</Select.Option> */}
            </Select>
            <p
              className="bg-black text-white text-center rounded px-4 py-1 cursor-pointer"
              onClick={handleConvert}
            >
              Convert All
            </p>
            {results.length > 0 && (
              <p
                className="border border-black rounded px-4 py-1 cursor-pointer"
                onClick={handleDownload}
              >
                Download
              </p>
            )}
          </div>
        </div>
      )}
      <div className="flex flex-wrap gap-4 w-[80%]">
        {filePreviews.map((file, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              results.length > 0
                ? 'bg-green-500'
                : errors
                ? 'bg-red-400'
                : 'bg-gray-400'
            } w-full items-center justify-between shadow-md h-fit px-4 p-2 sm:flex-row`}
          >
            <div className="flex gap-8 items-center ">
              <p className="text-2xl">{index + 1}</p>
              <Image
                width={20}
                height={20}
                src={file.preview}
                alt={file.name}
                className="h-20 w-20 object-cover rounded-md"
              />
              <p className="text-sm">{file.name}</p>
            </div>
            <div className="flex gap-4 items-center sm:justify-between sm:max-w-fit justify-around w-full">
              <Select
                placeholder="format"
                size="small"
                style={{ minWidth: 'fit-content', width: '10rem' }}
                value={targetTypes[index]}
                onChange={(value) => handleType(index, value)}
              >
                <Select.Option value="jpeg">JPEG (.jpeg)</Select.Option>
                <Select.Option value="png">PNG (.png)</Select.Option>
                <Select.Option value="gif">GIF (.gif)</Select.Option>
                <Select.Option value="webp">WEBP (.webp)</Select.Option>
                <Select.Option value="tiff">TIFF (.tiff)</Select.Option>
                {/* <Select.Option value="bmp">BMP (.bmp)</Select.Option> */}
                {/* <Select.Option value="svg">SVG (.svg)</Select.Option> */}
                {/* <Select.Option value="ico">ICO (.ico)</Select.Option> */}
              </Select>
              {/* <p className="bg-black text-white rounded px-4 py-1 cursor-pointer">
                Convert
              </p> */}
              {/* <Trash2
                onClick={() => handleDelete(index)}
                color="red"
                className="cursor-pointer"
              /> */}
              <div
                className="flex cursor-pointer relative h-[20px] w-[25px]"
                onClick={() => handleDelete(index)}
              >
                <span className="text-[red] h-2 rotate-45 absolute left-[20%]">
                  ---
                </span>

                <span className="text-[red]  h-2 rotate-[-45deg] bottom-2 absolute top-0 left-[-30%]">
                  ---
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DropzoneComponent;
