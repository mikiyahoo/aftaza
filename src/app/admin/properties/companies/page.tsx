"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

interface Company {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  _count: {
    properties: number;
  };
}

interface CompanyFormData {
  name: string;
  description: string;
  website: string;
  logo_url: string;
  phone: string;
  email: string;
  address: string;
  is_active: boolean;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [formData, setFormData] = useState<CompanyFormData>({
    name: "",
    description: "",
    website: "",
    logo_url: "",
    phone: "",
    email: "",
    address: "",
    is_active: true,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  // Fetch companies
  useEffect(() => {
    fetchCompanies();
  }, []);

   const fetchCompanies = async () => {
     setLoading(true);
     try {
       const response = await fetch("/api/companies", {
         credentials: "include", // Important for sending cookies
       });
       
       if (!response.ok) {
         if (response.status === 401 || response.status === 403) {
           // Redirect to login or show unauthorized message
           window.location.href = "/admin/login";
           return;
         }
         throw new Error("Failed to fetch companies");
       }
       
       const data = await response.json();
       setCompanies(data);
       setFilteredCompanies(data);
     } catch (error) {
       console.error("Error fetching companies:", error);
       toast.error("Failed to load companies");
     } finally {
       setLoading(false);
     }
   };

  // Filter companies based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredCompanies(companies);
      return;
    }
    
    const filtered = companies.filter(company =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCompanies(filtered);
  }, [companies, searchTerm]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim()) {
      toast.error("Company name is required");
      return;
    }
    
    // Validate email format if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    // Validate website format if provided
    if (formData.website && !/^https?:\/\/.+\..+$/.test(formData.website)) {
      toast.error("Please enter a valid website URL (e.g., https://example.com)");
      return;
    }
    
    // Validate logo URL format if provided
    if (formData.logo_url && !/^https?:\/\/.+\..+\.(jpg|jpeg|png|gif|svg|webp)$/i.test(formData.logo_url)) {
      toast.error("Please enter a valid logo URL (must be an image file)");
      return;
    }
    
    try {
       let response;
       if (editingId) {
         // Update existing company
         response = await fetch(`/api/companies/${editingId}`, {
           method: "PUT",
           headers: {
             "Content-Type": "application/json",
           },
           credentials: "include",
           body: JSON.stringify({
             name: formData.name,
             description: formData.description || null,
             website: formData.website || null,
             logo_url: formData.logo_url || null,
             phone: formData.phone || null,
             email: formData.email || null,
             address: formData.address || null,
             is_active: formData.is_active,
           }),
         });
       } else {
         // Create new company
         response = await fetch("/api/companies", {
           method: "POST",
           headers: {
             "Content-Type": "application/json",
           },
           credentials: "include",
           body: JSON.stringify({
             name: formData.name,
             description: formData.description || null,
             website: formData.website || null,
             logo_url: formData.logo_url || null,
             phone: formData.phone || null,
             email: formData.email || null,
             address: formData.address || null,
             is_active: formData.is_active,
           }),
         });
       }

       if (!response.ok) {
         if (response.status === 401 || response.status === 403) {
           // Redirect to login or show unauthorized message
           window.location.href = "/admin/login";
           return;
         }
         const errorData = await response.json();
         throw new Error(errorData.error || "Failed to save company");
       }

       // Reset form and close dialog
       setFormData({
         name: "",
         description: "",
         website: "",
         logo_url: "",
         phone: "",
         email: "",
         address: "",
         is_active: true,
       });
       setEditingId(null);
       setIsFormOpen(false);
       
       // Refresh companies list
       await fetchCompanies();
       
       toast.success(editingId ? "Company updated successfully" : "Company created successfully");
     } catch (error) {
       console.error("Error saving company:", error);
       toast.error((error as Error).message || "Failed to save company");
     }
   };

   // Handle delete confirmation
   const handleDelete = async () => {
     if (!deleteId) return;
     
     setIsDeleting(true);
     try {
       const response = await fetch(`/api/companies/${deleteId}`, {
         method: "DELETE",
         credentials: "include",
       });
 
       if (!response.ok) {
         if (response.status === 401 || response.status === 403) {
           // Redirect to login or show unauthorized message
           window.location.href = "/admin/login";
           return;
         }
         const errorData = await response.json();
         throw new Error(errorData.error || "Failed to delete company");
       }
 
       setDeleteId(null);
       setIsDeleting(false);
       
       // Refresh companies list
       await fetchCompanies();
       
       toast.success("Company deleted successfully");
     } catch (error) {
       console.error("Error deleting company:", error);
       setIsDeleting(false);
       toast.error((error as Error).message || "Failed to delete company");
     }
   };

  // Handle form open for new company
  const handleAddCompany = () => {
    setFormData({
      name: "",
      description: "",
      website: "",
      logo_url: "",
      phone: "",
      email: "",
      address: "",
      is_active: true,
    });
    setEditingId(null);
    setIsFormOpen(true);
  };

  // Handle form open for editing company
  const handleEditCompany = (company: Company) => {
    // Note: We don't have the full company data with description, website, etc.
    // This would need to be fetched from the API for a complete edit experience
    // For now, we populate what we have and leave the rest empty
    setFormData({
      name: company.name,
      description: "",
      website: "",
      logo_url: "",
      phone: company.phone || "",
      email: company.email || "",
      address: "",
      is_active: true,
    });
    setEditingId(company.id);
    setIsFormOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Companies Management</h1>
          <Button variant="gold" onClick={handleAddCompany}>
            <span className="mr-2">+</span> Add Company
          </Button>
        </div>
        <div className="animate-pulse h-96">
          Loading companies...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Companies Management</h1>
        <Button variant="gold" onClick={handleAddCompany}>
          <span className="mr-2">+</span> Add Company
        </Button>
      </div>
      
      {/* Search Filter */}
      <div className="mb-6">
        <input
          placeholder="Search companies by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus-ring-[var(--property-action-blue)]"
        />
      </div>
      
      {/* Companies Table */}
      <div className="space-y-4">
        {filteredCompanies.length === 0 ? (
          <p className="text-center py-8 text-slate-500">
            No companies found.{" "}
            {searchTerm ? (
              <>
                Try removing your search filter to see all companies.
              </>
            ) : (
              "Add your first company using the button above."
            )}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    # Properties
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-48">
                      {company.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {company.phone || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {company.email || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-20">
                      {company._count.properties}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium w-24 flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCompany(company)}
                      >
                        <span className="mr-1">✎</span> Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(company.id)}
                      >
                        <span className="mr-1">🗑️</span> Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Add/Edit Company Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="relative bg-white rounded-lg shadow">
              {/* Modal Header */}
              <div className="flex items-start justify-between p-4 border-b rounded-t">
                <h3 className="text-xl font-medium text-gray-900">
                  {editingId ? "Edit Company" : "Add Company"}
                </h3>
                <button
                  type="button"
                  className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  onClick={() => setIsFormOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <span className="h-5 w-5">×</span>
                </button>
              </div>
              
              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Company Name */}
                <div>
                  <label htmlFor="company-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    id="company-name"
                    type="text"
                    placeholder="Enter company name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a34d] focus:border-transparent transition-colors"
                  />
                </div>
                
                {/* Description */}
                <div>
                  <label htmlFor="company-description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="company-description"
                    placeholder="Enter company description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a34d] focus:border-transparent transition-colors resize-vertical"
                  />
                </div>
                
                {/* Website */}
                <div>
                  <label htmlFor="company-website" className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    id="company-website"
                    type="url"
                    placeholder="https://example.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a34d] focus:border-transparent transition-colors"
                  />
                </div>
                
                {/* Logo URL */}
                <div>
                  <label htmlFor="company-logo" className="block text-sm font-medium text-gray-700 mb-1">
                    Logo URL
                  </label>
                  <input
                    id="company-logo"
                    type="url"
                    placeholder="https://example.com/logo.png"
                    value={formData.logo_url}
                    onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a34d] focus:border-transparent transition-colors"
                  />
                </div>
                
                {/* Phone Number */}
                <div>
                  <label htmlFor="company-phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    id="company-phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a34d] focus:border-transparent transition-colors"
                  />
                </div>
                
                {/* Email Address */}
                <div>
                  <label htmlFor="company-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="company-email"
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a34d] focus:border-transparent transition-colors"
                  />
                </div>
                
                {/* Address */}
                <div>
                  <label htmlFor="company-address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    id="company-address"
                    type="text"
                    placeholder="Enter company address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a34d] focus:border-transparent transition-colors"
                  />
                </div>
                
                {/* Is Active Toggle */}
                <div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-4 h-4 text-[#c8a34d] bg-gray-100 border-gray-300 rounded focus:ring-[#c8a34d] focus:ring-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Company is Active</span>
                  </label>
                </div>
                
                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="gold"
                    type="submit"
                  >
                    {editingId ? "Update Company" : "Add Company"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-md">
            <div className="relative bg-white rounded-lg shadow">
              {/* Modal Header */}
              <div className="flex items-start justify-between p-4 border-b rounded-t">
                <h3 className="text-xl font-medium text-gray-900">
                  Confirm Deletion
                </h3>
                <button
                  type="button"
                  className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  onClick={() => setDeleteId(null)}
                >
                  <span className="sr-only">Close</span>
                  <span className="h-5 w-5">×</span>
                </button>
              </div>
              
              {/* Modal Body */}
              <div className="p-6 space-y-4">
                <p className="text-slate-600">
                  This will permanently remove the company from the system.
                </p>
                {deleteId && (
                  <p className="font-medium">
                    Company ID: {deleteId}
                  </p>
                )}
              </div>
              
              {/* Modal Footer */}
              <div className="flex items-center justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setDeleteId(null)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="loading-indicator"
                >
                  {isDeleting ? "Deleting..." : "Delete Company"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
