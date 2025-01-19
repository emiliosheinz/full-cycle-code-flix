describe('CategoryOutputMapper', () => {
    test('should return a category output', () => {
        const category = new Category({
            name: 'Movie',
            description: 'A movie category',
            is_active: true,
        });

        const output = CategoryOutputMapper.toDTO(category);

        expect(output).toStrictEqual({
            id: category.category_id.id,
            name: category.name,
            description: category.description,
            is_active: category.is_active,
            created_at: category.created_at,
        });
    });
});

