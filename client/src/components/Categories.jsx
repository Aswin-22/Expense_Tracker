import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  clearCategoryError,
} from "../redux/categorySlice";

/* ── Small inline form for create / rename ── */
function CategoryForm({
  onSubmit,
  initial = {},
  submitLabel = "Add",
  onCancel,
}) {
  const [name, setName] = useState(initial.name || "");
  const [type, setType] = useState(initial.type || "EXPENSE");
  const [color, setColor] = useState(initial.color || "#888888");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    onSubmit({ name: name.trim(), type, color });

    if (!initial.name) {
      setName("");
      setType("EXPENSE");
      setColor("#888888");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="category-form">
      <input
        type="text"
        placeholder="Category name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      {/* Only show type selector on create, not rename */}
      {!initial.name && (
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="EXPENSE">Expense</option>
          <option value="INCOME">Income</option>
        </select>
      )}
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        title="Pick a color"
        className="color-picker"
      />
      <button
        type="submit"
        className="btn btn-primary"
        style={{ padding: "var(--space-2) var(--space-4)" }}
      >
        {submitLabel}
      </button>
      {onCancel && (
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
}

/* ── Single category row ── */
function CategoryRow({ category, onDelete, onRename }) {
  const [editing, setEditing] = useState(false);

  const handleRename = (data) => {
    onRename(category._id, data);
    setEditing(false);
  };

  return (
    <li className="category-item">
      {editing ? (
        <CategoryForm
          initial={{ name: category.name, color: category.color }}
          onSubmit={handleRename}
          submitLabel="Save"
          onCancel={() => setEditing(false)}
        />
      ) : (
        <>
          <div className="category-info">
            <span
              className="category-dot"
              style={{ backgroundColor: category.color }}
            />
            <span className="font-medium">{category.name}</span>
          </div>
          <div className="flex gap-2">
            <button
              className="btn btn-ghost text-sm"
              onClick={() => setEditing(true)}
            >
              Rename
            </button>
            <button
              className="btn btn-danger text-sm"
              onClick={() => onDelete(category._id)}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
}

/* ── Main Categories Page ── */
const Categories = () => {
  const dispatch = useDispatch();
  const { categories, status, error } = useSelector(
    (state) => state.categories,
  );

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(clearCategoryError());
  }, [dispatch]);

  const handleCreate = async (data) => {
    await dispatch(createCategory(data));
  };

  const handleRename = async (id, data) => {
    await dispatch(updateCategory({ id, data }));
  };

  const handleDelete = async (id) => {
    const result = await dispatch(deleteCategory(id));
    // deleteCategory.rejected sets error in state — shown below
    if (deleteCategory.rejected.match(result)) return;
  };

  const expenseCategories = categories.filter((c) => c.type === "EXPENSE");
  const incomeCategories = categories.filter((c) => c.type === "INCOME");

  return (
    <div className="page-wrapper">
      <div style={{ marginBottom: "var(--space-8)" }}>
        <h2>Categories</h2>
        <p className="text-muted">Manage your income and expense categories.</p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button
            className="btn btn-ghost text-sm"
            onClick={() => dispatch(clearCategoryError())}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Add new category */}
      <div className="card" style={{ marginBottom: "var(--space-8)" }}>
        <h3 style={{ marginBottom: "var(--space-6)" }}>Add Category</h3>
        <CategoryForm onSubmit={handleCreate} submitLabel="Add Category" />
      </div>

      {status === "loading" && (
        <div className="loading-state">
          <p>Loading...</p>
        </div>
      )}

      {/* Expense categories */}
      <div className="card" style={{ marginBottom: "var(--space-6)" }}>
        <h3 style={{ marginBottom: "var(--space-6)" }}>
          Expense Categories
          <span
            className="text-muted text-sm font-normal"
            style={{ marginLeft: "var(--space-3)" }}
          >
            ({expenseCategories.length})
          </span>
        </h3>
        {expenseCategories.length === 0 ? (
          <p className="text-muted text-sm">No expense categories yet.</p>
        ) : (
          <ul className="category-list">
            {expenseCategories.map((c) => (
              <CategoryRow
                key={c._id}
                category={c}
                onDelete={handleDelete}
                onRename={handleRename}
              />
            ))}
          </ul>
        )}
      </div>

      {/* Income categories */}
      <div className="card">
        <h3 style={{ marginBottom: "var(--space-6)" }}>
          Income Categories
          <span
            className="text-muted text-sm font-normal"
            style={{ marginLeft: "var(--space-3)" }}
          >
            ({incomeCategories.length})
          </span>
        </h3>
        {incomeCategories.length === 0 ? (
          <p className="text-muted text-sm">No income categories yet.</p>
        ) : (
          <ul className="category-list">
            {incomeCategories.map((c) => (
              <CategoryRow
                key={c._id}
                category={c}
                onDelete={handleDelete}
                onRename={handleRename}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Categories;
