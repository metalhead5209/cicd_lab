import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App.jsx';
import '@testing-library/jest-dom';


describe('App Component', () => {
    it('CICD Pipeline', () => {
        render(<App />);
        const headingElement = screen.getByText(/CICD Pipeline/i);
        expect(headingElement).toBeInTheDocument();
    });
})