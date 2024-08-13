// src/types/virtualKeyboard.d.ts
interface VirtualKeyboard {
    overlaysContent: boolean;
    show(): void;
    addEventListener(type: 'geometrychange', listener: (event: Event) => void): void;
}

interface Navigator {
    virtualKeyboard?: VirtualKeyboard;
}
