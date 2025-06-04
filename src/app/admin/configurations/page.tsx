"use client";

import { useState, useEffect, FormEvent } from "react";
import { ConfigurationItem } from "../../api/configurations/route"; // Adjust path as necessary

interface EditableConfigurationItem extends ConfigurationItem {
  isEditing?: boolean;
  original_config_value?: string | null; // To store original value during edit
}

export default function ManageConfigurationsPage() {
  const [configurations, setConfigurations] = useState<
    EditableConfigurationItem[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newConfigKey, setNewConfigKey] = useState("");
  const [newConfigValue, setNewConfigValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const fetchConfigurations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/configurations");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch configurations");
      }
      const data: ConfigurationItem[] = await response.json();
      setConfigurations(
        data.map((item) => ({
          ...item,
          isEditing: false,
          original_config_value: item.config_value,
        }))
      );
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigurations();
  }, []);

  const handleAddConfiguration = async (e: FormEvent) => {
    e.preventDefault();
    if (!newConfigKey.trim()) {
      alert("Configuration key cannot be empty.");
      return;
    }
    setIsAdding(true);
    try {
      const response = await fetch("/api/configurations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config_key: newConfigKey,
          config_value: newConfigValue,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add configuration");
      }
      setNewConfigKey("");
      setNewConfigValue("");
      fetchConfigurations(); // Refresh list
      alert("Configuration added successfully!");
    } catch (err) {
      alert(
        "Error adding configuration: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteConfiguration = async (key: string) => {
    if (
      !confirm(`Are you sure you want to delete the configuration "${key}"?`)
    ) {
      return;
    }
    try {
      const response = await fetch(`/api/config/${encodeURIComponent(key)}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete configuration");
      }
      fetchConfigurations(); // Refresh list
      alert("Configuration deleted successfully!");
    } catch (err) {
      alert(
        "Error deleting configuration: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    }
  };

  const toggleEditMode = (id: number) => {
    setConfigurations((configs) =>
      configs.map((config) =>
        config.id === id
          ? {
              ...config,
              isEditing: !config.isEditing,
              config_value: config.isEditing
                ? config.original_config_value ?? null
                : config.config_value /* reset on cancel */,
            }
          : config
      )
    );
  };

  const handleValueChange = (id: number, value: string) => {
    setConfigurations((configs) =>
      configs.map((config) =>
        config.id === id ? { ...config, config_value: value } : config
      )
    );
  };

  const handleUpdateConfiguration = async (item: EditableConfigurationItem) => {
    if (item.config_value === item.original_config_value) {
      toggleEditMode(item.id);
      alert("No changes made.");
      return;
    }
    try {
      const response = await fetch(
        `/api/config/${encodeURIComponent(item.config_key)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ config_value: item.config_value }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update configuration");
      }
      fetchConfigurations(); // Refresh list to get new updated_at and confirm change
      alert("Configuration updated successfully!");
    } catch (err) {
      alert(
        "Error updating configuration: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
      // Optionally revert change on error or re-fetch to get original state
      setConfigurations((configs) =>
        configs.map((config) =>
          config.id === item.id
            ? {
                ...config,
                isEditing: false,
                config_value: config.original_config_value ?? null,
              }
            : config
        )
      );
    }
  };

  if (isLoading)
    return <p className="text-center p-4">Loading configurations...</p>;
  if (error)
    return <p className="text-center p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-10 text-primary text-center">
        Manage General Configurations
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-primary">
          Add New Configuration
        </h2>
        <form onSubmit={handleAddConfiguration} className="space-y-4">
          <div>
            <label
              htmlFor="config_key"
              className="block text-sm font-medium text-gray-700"
            >
              Configuration Key
            </label>
            <input
              type="text"
              id="config_key"
              value={newConfigKey}
              onChange={(e) => setNewConfigKey(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="config_value"
              className="block text-sm font-medium text-gray-700"
            >
              Configuration Value
            </label>
            <textarea
              id="config_value"
              value={newConfigValue}
              onChange={(e) => setNewConfigValue(e.target.value)}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={isAdding}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isAdding ? "Adding..." : "Add Configuration"}
          </button>
        </form>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-primary">
          Existing Configurations
        </h2>
        {configurations.length === 0 ? (
          <p>No configurations found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Key
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Value
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Last Updated
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {configurations.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.config_key}
                    </td>
                    <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-500 break-all">
                      {item.isEditing ? (
                        <textarea
                          value={item.config_value || ""}
                          onChange={(e) =>
                            handleValueChange(item.id, e.target.value)
                          }
                          rows={3}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      ) : (
                        item.config_value
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.updated_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {item.isEditing ? (
                        <>
                          <button
                            onClick={() => handleUpdateConfiguration(item)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => toggleEditMode(item.id)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => toggleEditMode(item.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() =>
                          handleDeleteConfiguration(item.config_key)
                        }
                        className="text-red-600 hover:text-red-900 ml-2"
                        disabled={item.isEditing}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
