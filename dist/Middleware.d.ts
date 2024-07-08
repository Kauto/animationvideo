import { default as Callback } from './Middleware/Camera';
import { default as CameraControl } from './Middleware/CameraControl';
import { default as CameraControlSecondButton } from './Middleware/CameraControlSecondButton';
import { default as Click } from './Middleware/Click';
import { default as Element } from './Middleware/Element';
import { default as LoadingScreen } from './Middleware/LoadingScreen';
import { default as Norm } from './Middleware/Norm';
import { default as TimingAudio } from './Middleware/TimingAudio';
import { default as TimingDefault } from './Middleware/TimingDefault';
import { default as Event } from './Middleware/Events';

declare const _default: {
    Callback: typeof Callback;
    Camera: typeof Callback;
    CameraControl: typeof CameraControl;
    CameraControlSecondButton: typeof CameraControlSecondButton;
    Click: typeof Click;
    Element: typeof Element;
    Event: typeof Event;
    LoadingScreen: typeof LoadingScreen;
    Norm: typeof Norm;
    TimingAudio: typeof TimingAudio;
    TimingDefault: typeof TimingDefault;
};
export default _default;
