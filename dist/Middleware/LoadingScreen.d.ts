import type { ConfigurationObject, ParameterListLoading } from "../Scene";
export default class LoadingScreen implements ConfigurationObject {
    loading({ output, progress }: ParameterListLoading): void;
}
