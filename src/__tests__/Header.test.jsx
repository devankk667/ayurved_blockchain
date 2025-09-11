import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../components/Header';

describe('Header Component', () => {
  it('renders both tab buttons', () => {
    render(<Header activeTab="scan" setActiveTab={() => {}} />);

    expect(screen.getByRole('button', { name: /scan herb/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /results/i })).toBeInTheDocument();
  });

  it('highlights the active tab', () => {
    const { rerender } = render(<Header activeTab="scan" setActiveTab={() => {}} />);

    // Scan tab should have the active classes
    const scanButton = screen.getByRole('button', { name: /scan herb/i });
    expect(scanButton).toHaveClass('text-green-600 border-b-2 border-green-600');

    // Rerender with 'results' as the active tab
    rerender(<Header activeTab="results" setActiveTab={() => {}} />);

    const resultsButton = screen.getByRole('button', { name: /results/i });
    expect(resultsButton).toHaveClass('text-green-600 border-b-2 border-green-600');
    // The scan button should no longer have the active classes
    expect(scanButton).not.toHaveClass('text-green-600 border-b-2 border-green-600');
  });

  it('calls setActiveTab with the correct argument when a tab is clicked', () => {
    const setActiveTabMock = jest.fn();
    render(<Header activeTab="scan" setActiveTab={setActiveTabMock} />);

    const resultsButton = screen.getByRole('button', { name: /results/i });
    fireEvent.click(resultsButton);

    expect(setActiveTabMock).toHaveBeenCalledTimes(1);
    expect(setActiveTabMock).toHaveBeenCalledWith('results');
  });
});
