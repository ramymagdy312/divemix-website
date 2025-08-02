"use client";

import { productCategories } from "../../data/productCategories";
import SearchBar from "./SearchBar";
import CategoryCard from "./CategoryCard";
import { useSearch } from "../../hooks/useSearch";
import AnimatedElement from "../common/AnimatedElement";

const CategoryList = () => {
  const { searchTerm, setSearchTerm, filteredItems } = useSearch(
    productCategories,
    ["categoryName", "shortDesc"]
  );

  return (
    <AnimatedElement animation="fadeIn">
      <div>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search categories..."
        />

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredItems.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={{
                  id: category.id,
                  name: category.categoryName,
                  description: category.shortDesc,
                  slug: category.slug || category.id,
                  image_url: category.image,
                  is_active: true,
                  display_order: index + 1,
                  categoryName: category.categoryName,
                  shortDesc: category.shortDesc,
                  image: category.image,
                  hero: category.hero
                }}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No categories found matching your search.
            </p>
          </div>
        )}
      </div>
    </AnimatedElement>
  );
};

export default CategoryList;
