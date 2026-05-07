"use client";

import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import CloudinaryUploadButton from "../../../components/ui/CloudinaryUploadButton";
import { InstagramPost } from "../../../types/instagramPost";

export default function ManageInstagramPostsPage() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  const [newPostUrl, setNewPostUrl] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/instagram-posts");
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to fetch posts");
      }
      const data: InstagramPost[] = await res.json();
      setPosts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!newPostUrl.trim() || !newImageUrl.trim()) {
      alert("El link de Instagram y la imagen son requeridos.");
      return;
    }
    setIsAdding(true);
    try {
      const nextOrder = posts.length > 0 ? Math.max(...posts.map((p) => p.order_number)) + 1 : 0;
      const res = await fetch("/api/admin/instagram-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_url: newPostUrl,
          image_url: newImageUrl,
          order_number: nextOrder,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add post");
      }
      setNewPostUrl("");
      setNewImageUrl("");
      await fetchPosts();
    } catch (err) {
      alert("Error al agregar post: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que quieres eliminar este post?")) return;
    try {
      const res = await fetch(`/api/admin/instagram-posts?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete post");
      }
      await fetchPosts();
    } catch (err) {
      alert("Error al eliminar post: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const movePost = (index: number, direction: "up" | "down") => {
    const newPosts = [...posts];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newPosts.length) return;
    [newPosts[index], newPosts[swapIndex]] = [newPosts[swapIndex], newPosts[index]];
    setPosts(newPosts);
  };

  const handleSaveOrder = async () => {
    setIsSavingOrder(true);
    try {
      await Promise.all(
        posts.map((post, index) =>
          fetch("/api/admin/instagram-posts", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: post.id, order_number: index }),
          })
        )
      );
      await fetchPosts();
      alert("Orden guardado correctamente.");
    } catch (err) {
      alert("Error al guardar orden: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setIsSavingOrder(false);
    }
  };

  if (isLoading) return <p className="text-center p-4">Cargando posts...</p>;
  if (error) return <p className="text-center p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-10 text-primary text-center">
        Administrar Posts de Instagram
      </h1>

      {/* Add Post Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-primary">Agregar Nuevo Post</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label htmlFor="post_url" className="block text-sm font-medium text-gray-700">
              Link de Instagram
            </label>
            <input
              type="url"
              id="post_url"
              value={newPostUrl}
              onChange={(e) => setNewPostUrl(e.target.value)}
              placeholder="https://www.instagram.com/p/..."
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <CloudinaryUploadButton
            value={newImageUrl}
            onChange={setNewImageUrl}
            label="Imagen del Post"
            folder="integral-surf/instagram"
            required
          />
          <button
            type="submit"
            disabled={isAdding}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isAdding ? "Agregando..." : "Agregar Post"}
          </button>
        </form>
      </div>

      {/* Posts List */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-primary">Posts Actuales</h2>
          {posts.length > 1 && (
            <button
              onClick={handleSaveOrder}
              disabled={isSavingOrder}
              className="py-2 px-4 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {isSavingOrder ? "Guardando..." : "Guardar Orden"}
            </button>
          )}
        </div>

        {posts.length === 0 ? (
          <p className="text-gray-500">No hay posts aún. Agrega uno arriba.</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post, index) => (
              <div
                key={post.id}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
              >
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={post.image_url}
                    alt="Instagram post"
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-md"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <a
                    href={post.post_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-800 truncate block"
                  >
                    {post.post_url}
                  </a>
                  <p className="text-xs text-gray-400 mt-1">Orden: {index}</p>
                </div>
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <button
                    onClick={() => movePost(index, "up")}
                    disabled={index === 0}
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-30 transition-colors"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => movePost(index, "down")}
                    disabled={index === posts.length - 1}
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-30 transition-colors"
                  >
                    ▼
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="flex-shrink-0 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
