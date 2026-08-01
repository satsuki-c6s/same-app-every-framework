import '../../shared/app.css';
import { mount } from 'svelte';
import AppSpecialty from './AppSpecialty.svelte';

const app = mount(AppSpecialty, { target: document.getElementById('app')! });

export default app;
