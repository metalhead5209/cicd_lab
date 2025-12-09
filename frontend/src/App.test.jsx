import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App.jsx'
import '@testing-library/jest-dom'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('App Component', () => {
  it('renders heading and backend status', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, message: 'Server is alive and running' })
    })

    render(<App />)

    expect(screen.getByText(/CICD Pipeline/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText(/healthy/i)).toBeInTheDocument()
    })
    expect(screen.getByText(/Server is alive and running/i)).toBeInTheDocument()
  })
})
