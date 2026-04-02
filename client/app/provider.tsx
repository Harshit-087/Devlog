import { QueryClient,QueryClientProvider } from "@tanstack/react-query";
import store from '../store/store'
import { Provider } from 'react-redux'
export default function Wrapper( {children}: {children:React.ReactNode}){

    const queryClient = new QueryClient();
   return(
    <>
    <Provider store={store}>
    <QueryClientProvider client = {queryClient}>
        {children}
    </QueryClientProvider>
    </Provider>
    </>
   )
}