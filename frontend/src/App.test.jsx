import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App.jsx';
import '@testing-library/jest-dom';


describe('App Component', () => {
    it('renders Vite + React heading', () => {
        render(<App />);
        const headingElement = screen.getByText(/Vite \+ React/i);
        expect(headingElement).toBeInTheDocument();
    });
})