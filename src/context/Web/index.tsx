import React, {
    createContext,
    FunctionComponent,
    useState,
    useEffect,
} from 'react';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Toast from 'react-bootstrap/Toast';

// Components
import { SplashComponent } from '@client/components';

// Services
import services from '@client/services';

// Interfaces
import type { IUserInfoForUser, IUserUpdateInfo, ISelect } from '@interfaces';

// Type
type NotificationStatus = 'success' | 'danger' | 'warning' | 'info';

// Interface
interface ContextInterface {
    user: IUserInfoForUser | null;
    regions: ISelect[];

    onLogin(data: IUserInfoForUser): void;
    onLogout(): void;
    onUpdateUser(data: IUserUpdateInfo): void;
    onNotification(message: string, status?: NotificationStatus): void;
}
interface Notification {
    status: NotificationStatus | 'primary';
    message: string;
}

// Props
interface Props {
    children: React.ReactNode;
}

// Context Default
const contextDefault: ContextInterface = {
    user: null,
    regions: [],

    onLogin() {
        console.log('Login');
    },
    onLogout() {
        console.log('Logout');
    },
    onUpdateUser() {
        console.log('Update User');
    },
    onNotification() {
        console.log('Notification');
    },
};

export const Context = createContext<ContextInterface>(contextDefault);

const Index: FunctionComponent<Props> = ({ children }) => {
    // States
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    const [user, setUser] = useState<IUserInfoForUser | null>(null);
    const [regions, setRegions] = useState<ISelect[]>([]);
    const [notification, setNotification] = useState<Notification | null>(null);

    // Effects
    useEffect(() => {
        const controller = new AbortController();

        const getData = async (signal: AbortSignal) => {
            const result = await services.first(signal);

            setRegions(result.regions);

            if (result.mode === 'login') {
                setUser(result.user);
            }
        };

        getData(controller.signal).finally(() => setIsLoaded(true));

        return () => controller.abort();
    }, []);

    // Handles
    const handleLogin = (data: IUserInfoForUser) => setUser(data);
    const handleLogout = () => setUser(null);
    const handleUpdateUser = (data: IUserUpdateInfo) => {
        if (user) {
            const { address, avatar, birthday, fullName } = data;

            let updateUser = user;

            if (address) {
                updateUser = { ...updateUser, address };
            }

            if (birthday) {
                updateUser = { ...updateUser, birthday };
            }

            if (avatar) {
                updateUser = { ...updateUser, avatar };
            }

            if (fullName) {
                updateUser = { ...updateUser, fullName };
            }

            setUser(updateUser);
        }
    };
    const handleNotification = (message: string, status?: NotificationStatus) =>
        setNotification({ message, status: status ? status : 'primary' });
    const handleCloseNotification = () => setNotification(null);

    const value: ContextInterface = {
        user,
        regions,

        onLogin: handleLogin,
        onLogout: handleLogout,
        onUpdateUser: handleUpdateUser,
        onNotification: handleNotification,
    };

    if (!isLoaded) return <SplashComponent />;

    return (
        <Context.Provider value={value}>
            <ToastContainer position='top-end' className='p-3 position-fixed'>
                <Toast
                    autohide
                    bg={notification ? notification.status : undefined}
                    delay={5000}
                    onClose={handleCloseNotification}
                    show={notification !== null}
                >
                    <Toast.Body>
                        <p className='h5 m-0 px-2' style={{ color: 'white' }}>
                            {notification
                                ? notification.message
                                : 'Notification'}
                        </p>
                    </Toast.Body>
                </Toast>
            </ToastContainer>
            {children}
        </Context.Provider>
    );
};

export default Index;
