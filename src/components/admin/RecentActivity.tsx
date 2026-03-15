export default function RecentActivity({ properties, inquiries }: { properties: Array<{ id: number; title: string; created_at: string; company: { name: string } }>; inquiries: Array<{ id: string; name: string; email: string; created_at: string; property: { title: string } }> }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Properties */}
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-3">Recent Properties</h4>
          <div className="space-y-3">
            {properties.slice(0, 5).map((property) => (
              <div key={property.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-sm">{property.title}</p>
                  <p className="text-xs text-gray-500">{property.company.name}</p>
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(property.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-3">Recent Inquiries</h4>
          <div className="space-y-3">
            {inquiries.slice(0, 5).map((inquiry) => (
              <div key={inquiry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-sm">{inquiry.name}</p>
                  <p className="text-xs text-gray-500">{inquiry.property.title}</p>
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(inquiry.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
