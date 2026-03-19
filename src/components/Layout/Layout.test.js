import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

jest.unstable_mockModule('../../context/AuthProvider', () => ({
  useAuth: () => ({ user: { displayName: 'Test User' }, logout: jest.fn() })
}));
jest.unstable_mockModule('../../context/ThemeContext', () => ({
  useThemeControl: () => ({ mode: 'light', toggleTheme: jest.fn() })
}));
jest.unstable_mockModule('../../context/NotificationContext', () => ({
  useNotifications: () => ({ unreadCount: 0, notifications: [] })
}));
jest.unstable_mockModule('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/' }),
  useNavigate: () => jest.fn(),
  Link: ({ children }) => <a>{children}</a>
}));

// We MUST import Layout dynamically AFTER the unstable_mockModules are defined
// so that the mocks take precedence.
const { default: Layout } = await import('./Layout');

describe('Layout Mobile Overlay', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500
    });
    window.dispatchEvent(new Event('resize'));
  });

  it('toggles the sidebar overlay on mobile and closes on overlay click', () => {
    render(
      <Layout sidebarContent={<div data-testid="sidebar-content">Sidebar</div>}>
        <div data-testid="page-content">Page Content</div>
      </Layout>
    );

    const overlay = screen.getByTestId('sidebar-overlay');
    expect(overlay).not.toHaveClass('is-open');

    const toggleBtn = screen.getByTestId('sidebar-toggle-btn');
    act(() => {
      fireEvent.click(toggleBtn);
    });

    expect(overlay).toHaveClass('is-open');

    act(() => {
      fireEvent.click(overlay);
    });

    expect(overlay).not.toHaveClass('is-open');
  });
});
