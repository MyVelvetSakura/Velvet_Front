import { describe, it, expect, vi, beforeEach } from 'vitest';
import httpClient from './httpClient';
import apiAccount from './apiAccount';

vi.mock('./httpClient', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
    },
}));

describe('apiAccount', () => {
    const db = apiAccount();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('addAccount envía un POST a /accounts con los datos del formulario', async () => {
        const formData = { name: 'NuevaUsuaria', email: 'nueva@gmail.com', password: 'password123' };
        httpClient.post.mockResolvedValueOnce({ data: { id: 1, ...formData } });

        const result = await db.addAccount(formData);

        expect(httpClient.post).toHaveBeenCalledWith('/accounts', formData);
        expect(result).toEqual({ id: 1, ...formData });
    });

    it('login envía un POST a /accounts/login con name y password', async () => {
        httpClient.post.mockResolvedValueOnce({
            data: { account: { id: 1, name: 'Ragnarok1' }, token: 'fake-jwt-token' },
        });

        const result = await db.login('Ragnarok1', 'password123');

        expect(httpClient.post).toHaveBeenCalledWith('/accounts/login', {
            name: 'Ragnarok1',
            password: 'password123',
        });
        expect(result.token).toBe('fake-jwt-token');
    });

    it('editAccount envía un PATCH a /accounts/{id} con el nuevo nombre', async () => {
        httpClient.patch.mockResolvedValueOnce({ data: { id: 1, name: 'NuevoNombre' } });

        const result = await db.editAccount(1, 'NuevoNombre');

        expect(httpClient.patch).toHaveBeenCalledWith('/accounts/1', { name: 'NuevoNombre' });
        expect(result.name).toBe('NuevoNombre');
    });

    it('getByName envía un GET a /accounts con el parámetro name', async () => {
        httpClient.get.mockResolvedValueOnce({ data: [{ id: 1, name: 'Ragnarok1' }] });

        const result = await db.getByName('Ragnarok1');

        expect(httpClient.get).toHaveBeenCalledWith('/accounts', { params: { name: 'Ragnarok1' } });
        expect(result).toHaveLength(1);
    });

    it('verifyAccount envía un GET a /accounts/verify con el token', async () => {
        httpClient.get.mockResolvedValueOnce({ data: 'Cuenta verificada correctamente' });

        const result = await db.verifyAccount('token-abc-123');

        expect(httpClient.get).toHaveBeenCalledWith('/accounts/verify', { params: { token: 'token-abc-123' } });
        expect(result).toBe('Cuenta verificada correctamente');
    });

    it('forgotPassword envía un POST a /accounts/forgot-password con el email', async () => {
        httpClient.post.mockResolvedValueOnce({ data: 'Código enviado' });

        const result = await db.forgotPassword('ragnarok1@gmail.com');

        expect(httpClient.post).toHaveBeenCalledWith('/accounts/forgot-password', {
            email: 'ragnarok1@gmail.com',
        });
        expect(result).toBe('Código enviado');
    });

    it('resetPassword envía un POST a /accounts/reset-password con email, código y nueva contraseña', async () => {
        httpClient.post.mockResolvedValueOnce({ data: 'Contraseña actualizada' });

        const result = await db.resetPassword('ragnarok1@gmail.com', '483920', 'nuevaPassword123');

        expect(httpClient.post).toHaveBeenCalledWith('/accounts/reset-password', {
            email: 'ragnarok1@gmail.com',
            code: '483920',
            newPassword: 'nuevaPassword123',
        });
        expect(result).toBe('Contraseña actualizada');
    });

    it('updateAvatar envía un PATCH a /accounts/{id}/avatar con la nueva clave', async () => {
        httpClient.patch.mockResolvedValueOnce({ data: { id: 1, avatarKey: 'sakurachibi' } });

        const result = await db.updateAvatar(1, 'sakurachibi');

        expect(httpClient.patch).toHaveBeenCalledWith('/accounts/1/avatar', { avatarKey: 'sakurachibi' });
        expect(result.avatarKey).toBe('sakurachibi');
    });

    it('requestAccountDeletion envía un POST a /accounts/{id}/request-deletion con la contraseña', async () => {
        httpClient.post.mockResolvedValueOnce({ data: 'Email enviado' });

        const result = await db.requestAccountDeletion(1, 'password123');

        expect(httpClient.post).toHaveBeenCalledWith('/accounts/1/request-deletion', { password: 'password123' });
        expect(result).toBe('Email enviado');
    });

    it('confirmAccountDeletion envía un GET a /accounts/confirm-deletion con el token', async () => {
        httpClient.get.mockResolvedValueOnce({ data: 'Cuenta eliminada' });

        const result = await db.confirmAccountDeletion('token-delete-456');

        expect(httpClient.get).toHaveBeenCalledWith('/accounts/confirm-deletion', {
            params: { token: 'token-delete-456' },
        });
        expect(result).toBe('Cuenta eliminada');
    });

    it('propaga el error si la petición falla', async () => {
        const error = { response: { data: 'Contraseña incorrecta' } };
        httpClient.post.mockRejectedValueOnce(error);

        await expect(db.login('Ragnarok1', 'malaContraseña')).rejects.toEqual(error);
    });
});