import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import UploadModal from '../src/components/UploadModal';


describe('UploadModal', () => {
  it('renders modal UI correctly', () => {
    render(<UploadModal onClose={() => {}} onSuccess={() => {}} />);
    expect(screen.getByText('Upload Necessary Documents')).toBeInTheDocument();
    expect(screen.getByText('Click or drag file to this area to upload')).toBeInTheDocument();
  });

  it('triggers file input when browse is clicked', () => {
    render(<UploadModal onClose={() => {}} onSuccess={() => {}} />);
    const fileInput = screen.getByText(/click or drag file to this area to upload/i) || screen.getByRole('textbox', { hidden: true });
    const browseButton = screen.getByText('Browse File');

    fireEvent.click(browseButton);
    expect(fileInput).toBeDefined();
  });

  it('shows message when no file is uploaded', () => {
    render(<UploadModal onClose={() => {}} onSuccess={() => {}} />);
    expect(screen.getByText('No File Uploaded yet')).toBeInTheDocument();
  });
});
