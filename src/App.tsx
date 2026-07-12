import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Stack,
  Switch,
  FormControlLabel,
  ThemeProvider,
  CssBaseline,
  createTheme,
  useMediaQuery,
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import { fetchMotd, fetchMotdCount } from './api/motd'

type ColorMode = 'light' | 'dark'

const COLOR_MODE_STORAGE_KEY = 'motd-ui-color-mode'

function App() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const [mode, setMode] = useState<ColorMode>(() => {
    const stored = localStorage.getItem(COLOR_MODE_STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
    return prefersDark ? 'dark' : 'light'
  })

  useEffect(() => {
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, mode)
  }, [mode])

  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode])

  const [message, setMessage] = useState<string | null>(null)
  const [count, setCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadMessage = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const motd = await fetchMotd()
      setMessage(motd.text)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load message')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMotd()
      .then((motd) => setMessage(motd.text))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load message'))
      .finally(() => setLoading(false))
    fetchMotdCount()
      .then((c) => setCount(c.count))
      .catch(() => setCount(null))
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Card sx={{ width: '100%' }}>
            <CardContent>
              <Stack spacing={3} sx={{ alignItems: 'center', textAlign: 'center' }}>
                <FormControlLabel
                  sx={{ alignSelf: 'flex-end', mr: 0 }}
                  control={
                    <Switch
                      checked={mode === 'dark'}
                      onChange={(e) => setMode(e.target.checked ? 'dark' : 'light')}
                    />
                  }
                  label={mode === 'dark' ? 'Dark mode' : 'Light mode'}
                />

                <Typography variant="h4" component="h1">
                  Message of the Day
                </Typography>

                {loading && <CircularProgress />}

                {!loading && error && (
                  <Alert severity="error" sx={{ width: '100%' }}>
                    {error}
                  </Alert>
                )}

                {!loading && !error && message && (
                  <Typography variant="h6" component="p">
                    {message}
                  </Typography>
                )}

                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={loadMessage}
                  disabled={loading}
                >
                  New message
                </Button>

                {count !== null && (
                  <Typography variant="caption" color="text.secondary">
                    {count} messages available
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default App
