import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Container, Title, Text, Button } from '@mantine/core';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Container>
          <Title order={2}>Oops, something went wrong</Title>
          <Text color="red">{this.state.error?.message || 'An unexpected error occurred'}</Text>
          <Button onClick={() => window.location.reload()}>Reload page</Button>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;