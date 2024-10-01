import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

type Category = {
    description: string;
    categoryName: string;
    categoryImageUrl: string;
    id: string;
    created_at?: string | undefined;
    updated_at?: string | undefined;
}

type CategoryListProps = {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (id: string) => void;
}

export function CategoryList({ categories, onEdit, onDelete }: CategoryListProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Image URL</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {categories.map((category) => (
                    <TableRow key={category.id}>
                        <TableCell className="text-black">{category.categoryName}</TableCell>
                        <TableCell className="text-black">{category.description}</TableCell>
                        <TableCell className="text-black">{category.categoryImageUrl}</TableCell>
                        <TableCell>
                            <Button className="text-black mr-2" variant="outline" onClick={() => onEdit(category)}>Edit</Button>
                            <Button variant="destructive" onClick={() => onDelete(category.id)}>Delete</Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}