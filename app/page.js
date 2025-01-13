'use client';

import { useState } from 'react';
import Header from './componenets/Header/Header';
import Dropzone from './componenets/Dropzone/Dropzone';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <header>
        <Header isOpen={isOpen} setIsOpen={setIsOpen} />
      </header>
      {/* <aside>
        <SideNav />
      </aside> */}
      <main className="py-8 flex flex-col items-center">
        <Dropzone />
      </main>
      <footer></footer>
    </div>
  );
}
