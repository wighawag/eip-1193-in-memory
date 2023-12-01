import { EIP1193ProviderWithoutEvents } from 'eip-1193';
import { Provider } from '@remix-project/remix-simulator';

declare function wrapRemixSimulator(provider: Provider): EIP1193ProviderWithoutEvents;
declare function createProvider(): EIP1193ProviderWithoutEvents;

export { createProvider, wrapRemixSimulator };
