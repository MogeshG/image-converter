'use client';
import React, { useState } from 'react';
import MenuIcon from './MenuIcon';

const page = ({ isOpen, setIsOpen }) => {
  return (
    <div className="flex py-4 px-8 justify-between select-none">
      <div className="logo">
        {/* <MenuIcon isOpen={isOpen} setIsOpen={setIsOpen} /> */}
      </div>
      <div className="center">
        <h1 className="text-5xl">Image Converter</h1>
      </div>
      <div></div>
    </div>
  );
};

export default page;
