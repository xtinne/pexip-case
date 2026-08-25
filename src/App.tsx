import DeviceSummary from '@/components/DeviceSummary'
import DeviceHistoryChart from '@/components/DeviceHistoryChart'
import DeviceList from '@/components/DeviceList'

function App() {
  return (
    <div className='flex min-h-screen flex-col bg-background text-left'>
      <header className='bg-primary text-background'>
        <div className='mx-auto flex w-full max-w-7xl items-center px-6 py-5 lg:px-8'>
          <a
            href='/'
            className='text-xl font-semibold tracking-tight'
            aria-label='Pexip device dashboard home'
          >
            ] pexip [
          </a>
          <span className='ml-4 border-l border-background/30 pl-4 text-sm font-medium'>
            Tinne Jacobs
          </span>
        </div>
      </header>

      <main className='mx-auto w-full max-w-7xl flex-1 px-6 py-8 lg:px-8 lg:py-10'>
        <header className='mb-6'>
          <p className='mb-1 text-sm font-semibold text-accent'>
            Meeting rooms
          </p>
          <h1>Device fleet</h1>
          <p className='mt-2 text-text'>
            Monitor and manage every meeting room from one place.
          </p>
        </header>

        <section aria-labelledby='fleet-overview-heading'>
          <h2 id='fleet-overview-heading' className='sr-only'>
            Fleet status summary
          </h2>
          <DeviceSummary />
        </section>

        <DeviceHistoryChart />
        <DeviceList />
      </main>
    </div>
  )
}

export default App
