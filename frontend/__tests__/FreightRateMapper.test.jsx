import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FreightRateMapper from '../src/pages/FreightRateMapper';

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ success: true, data: [{ shipment_id: 'ABC123' }] }),
  })
);

describe('FreightRateMapper Page', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders header and button', async () => {
    render(<FreightRateMapper />);
    expect(screen.getByText(/Hello, John!/)).toBeInTheDocument();
    expect(screen.getByText('Import file')).toBeInTheDocument();

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });

  it('shows no data fallback when list is empty', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({ json: () => Promise.resolve({ success: true, data: [] }) })
    );
    render(<FreightRateMapper />);

    await waitFor(() => {
      expect(screen.getByText('No data has been added!')).toBeInTheDocument();
    });
  });

  it('opens modal on import button click', () => {
    render(<FreightRateMapper />);
    const importBtn = screen.getByText('Import file');
    fireEvent.click(importBtn);
    expect(screen.getByText(/Upload Necessary Documents/)).toBeInTheDocument();
  });
});
