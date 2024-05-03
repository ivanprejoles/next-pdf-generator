import { templateStore } from "@/lib/store";
import { Provider } from "react-redux";

const store = templateStore();

const ReduxProvider = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (  
        <Provider store={store}>
            {children}
        </Provider>
    );
}
 
export default ReduxProvider;