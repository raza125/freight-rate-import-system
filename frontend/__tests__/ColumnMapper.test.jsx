import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ColumnMapper from '../src/components/ColumnMapper';

describe('ColumnMapper', () => {
  const headers = ['Origin', 'Destination'];
  const sampleRows = [{ Origin: 'NY', Destination: 'LA' }, { Origin: 'Tokyo', Destination: 'Osaka' }];

  it('renders table with headers', () => {
    render(<ColumnMapper headers={headers} sampleRows={sampleRows} onMappingChange={() => {}} />);
    expect(screen.getByText('Origin')).toBeInTheDocument();
    expect(screen.getByText('Destination')).toBeInTheDocument();
  });

  it('calls onMappingChange when a mapping is selected', () => {
    const mockMappingChange = vi.fn();
    render(<ColumnMapper headers={headers} sampleRows={sampleRows} onMappingChange={mockMappingChange} />);

    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'OriginCountry' } });

    expect(mockMappingChange).toHaveBeenCalled();
  });
});
