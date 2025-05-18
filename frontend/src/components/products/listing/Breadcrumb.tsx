import React from 'react';
import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  currentPage: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, currentPage }) => {
  return (
    <div className="bg-gray-50 py-2">
      <div className="container mx-auto px-4">
        <nav className="flex items-center text-sm">
          <Link href="/" className="text-gray-500 hover:text-amber-600 transition-colors">
            Início
          </Link>
          
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <FiChevronRight className="mx-2 text-gray-400" />
              <Link href={item.href} className="text-gray-500 hover:text-amber-600 transition-colors">
                {item.label}
              </Link>
            </React.Fragment>
          ))}
          
          {currentPage && (
            <>
              <FiChevronRight className="mx-2 text-gray-400" />
              <span className="font-medium text-gray-800">{currentPage}</span>
            </>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb; 