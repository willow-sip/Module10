import { showNotification } from '@/components/notify';
import { createRoot } from 'react-dom/client';

jest.mock('@/components/Notification', () => jest.fn(() => null));

jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(),
}));

describe('general tests for showNotification', () => {
  let rootUnmount: jest.Mock;
  let rootRender: jest.Mock;

  beforeEach(() => {
    document.body.innerHTML = `<div id="notification-root"></div>`;
    rootUnmount = jest.fn();
    rootRender = jest.fn();
    (createRoot as jest.Mock).mockReturnValue({ unmount: rootUnmount, render: rootRender });
  });

  afterEach(() => jest.clearAllMocks());

  it('renders notification with correct props data', () => {
    showNotification('Something done', 'success', 3000);

    expect(createRoot).toHaveBeenCalled();
    expect(rootRender).toHaveBeenCalled();

    const props = rootRender.mock.calls[0][0].props;
    expect(props).toMatchObject({
      message: 'Something done',
      type: 'success',
      autoHide: 3000,
      isVisible: true,
    });

    props.close();
    expect(rootUnmount).toHaveBeenCalled();
  });

  it('returns close function', () => {
    const close = showNotification('Something done', 'success', 3000);
    expect(typeof close).toBe('function');
    close();
    expect(rootUnmount).toHaveBeenCalled();
  });
});