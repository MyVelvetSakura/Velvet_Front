import { describe, it, expect, vi, beforeEach } from 'vitest';
import httpClient from './httpClient';
import apiReading from './apiReading';

vi.mock('./httpClient', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
    },
}));

describe('apiReading', () => {
    const db = apiReading();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getByUserId envía un GET a /readings con el parámetro userId', async () => {
        httpClient.get.mockResolvedValueOnce({ data: [{ id: 1, name: 'Tirada 1' }] });

        const result = await db.getByUserId(10);

        expect(httpClient.get).toHaveBeenCalledWith('/readings', { params: { userId: 10 } });
        expect(result).toHaveLength(1);
    });

    it('createReading envía un POST a /readings con los datos de la lectura', async () => {
        const dataReading = {
            userId: 10,
            name: 'Mi tirada',
            pastCardId: 1,
            presentCardId: 2,
            futureCardId: 3,
            deckType: 'SAKURA',
            question: '¿Pregunta?',
            interpretation: 'Interpretación',
        };
        httpClient.post.mockResolvedValueOnce({ data: { id: 1, ...dataReading } });

        const result = await db.createReading(dataReading);

        expect(httpClient.post).toHaveBeenCalledWith('/readings', dataReading);
        expect(result.name).toBe('Mi tirada');
    });

    it('editName envía un PATCH a /readings/{id} con el nuevo nombre', async () => {
        httpClient.patch.mockResolvedValueOnce({ data: { id: 1, name: 'Nombre nuevo' } });

        const result = await db.editName(1, 'Nombre nuevo');

        expect(httpClient.patch).toHaveBeenCalledWith('/readings/1', { name: 'Nombre nuevo' });
        expect(result.name).toBe('Nombre nuevo');
    });

    it('deleteReading envía un DELETE a /readings/{id}', async () => {
        httpClient.delete.mockResolvedValueOnce({ status: 200 });

        await db.deleteReading(1);

        expect(httpClient.delete).toHaveBeenCalledWith('/readings/1');
    });

    it('deleteAllByUserId envía un DELETE a /readings con el parámetro userId', async () => {
        httpClient.delete.mockResolvedValueOnce({ status: 200 });

        await db.deleteAllByUserId(10);

        expect(httpClient.delete).toHaveBeenCalledWith('/readings', { params: { userId: 10 } });
    });

    it('getById envía un GET a /readings/{id}', async () => {
        httpClient.get.mockResolvedValueOnce({
            data: { id: 1, name: 'Mi tirada', question: '¿Pregunta?', interpretation: 'Interpretación' },
        });

        const result = await db.getById(1);

        expect(httpClient.get).toHaveBeenCalledWith('/readings/1');
        expect(result.interpretation).toBe('Interpretación');
    });

    it('propaga el error si el backend rechaza la creación de la lectura', async () => {
        const error = { response: { status: 400 } };
        httpClient.post.mockRejectedValueOnce(error);

        await expect(db.createReading({})).rejects.toEqual(error);
    });
});