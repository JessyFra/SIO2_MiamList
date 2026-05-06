package com.sio.miamlist.adapters;

import android.graphics.Paint;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;

import com.google.android.material.checkbox.MaterialCheckBox;
import android.widget.ImageButton;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.sio.miamlist.R;

import java.util.Collections;
import java.util.List;

public class ProductsAdapter extends RecyclerView.Adapter<ProductsAdapter.ViewHolder> {

    public interface OnProductActionListener {
        void onEdit(ProductItem item);
        void onDelete(ProductItem item);
        void onCheckedChanged(ProductItem item, boolean checked);
    }

    public interface DragListener {
        void startDrag(ViewHolder holder);
    }

    public static class ProductItem {
        public int     listItemId;
        public int     productId;
        public String  label;
        public float   quantity;
        public String  unit;
        public boolean checked;

        public ProductItem(int listItemId, int productId, String label,
                           float quantity, String unit, boolean checked) {
            this.listItemId = listItemId;
            this.productId  = productId;
            this.label      = label;
            this.quantity   = quantity;
            this.unit       = unit;
            this.checked    = checked;
        }
    }

    private final List<ProductItem>       items;
    private final OnProductActionListener listener;
    private DragListener                  dragListener;

    public ProductsAdapter(List<ProductItem> items, OnProductActionListener listener) {
        this.items    = items;
        this.listener = listener;
    }

    public void setDragListener(DragListener dl) {
        this.dragListener = dl;
    }

    public void onItemMoved(int from, int to) {
        Collections.swap(items, from, to);
        notifyItemMoved(from, to);
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_product, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        ProductItem item = items.get(position);

        holder.tvLabel.setText(item.label);
        bindQtyUnit(holder, item);
        applyCheckedStyle(holder, item.checked);

        // Checkbox
        holder.cbProduct.setOnCheckedChangeListener(null);
        holder.cbProduct.setChecked(item.checked);
        holder.cbProduct.setOnCheckedChangeListener((btn, isChecked) -> {
            item.checked = isChecked;
            applyCheckedStyle(holder, isChecked);
            listener.onCheckedChanged(item, isChecked);
        });

        holder.btnEdit.setOnClickListener(v -> listener.onEdit(item));
        holder.btnDelete.setOnClickListener(v -> listener.onDelete(item));

        // Bande orange gauche = poignée de glissement
        if (dragListener != null && holder.dragHandle != null) {
            holder.dragHandle.setOnTouchListener((v, event) -> {
                if (event.getAction() == MotionEvent.ACTION_DOWN) {
                    dragListener.startDrag(holder);
                }
                return false;
            });
        }
    }

    @Override
    public int getItemCount() { return items.size(); }

    private void bindQtyUnit(ViewHolder holder, ProductItem item) {
        if (item.quantity > 0) {
            String qty  = item.quantity == (int) item.quantity
                    ? String.valueOf((int) item.quantity)
                    : String.valueOf(item.quantity);
            String text = (item.unit != null && !item.unit.isEmpty())
                    ? qty + " " + item.unit : qty;
            holder.tvQtyUnit.setText(text);
            holder.tvQtyUnit.setVisibility(View.VISIBLE);
        } else {
            holder.tvQtyUnit.setVisibility(View.GONE);
        }
    }

    private void applyCheckedStyle(ViewHolder holder, boolean checked) {
        if (checked) {
            holder.tvLabel.setPaintFlags(
                    holder.tvLabel.getPaintFlags() | Paint.STRIKE_THRU_TEXT_FLAG);
            holder.tvLabel.setTextColor(0xFFBBBBBB);
        } else {
            holder.tvLabel.setPaintFlags(
                    holder.tvLabel.getPaintFlags() & ~Paint.STRIKE_THRU_TEXT_FLAG);
            holder.tvLabel.setTextColor(0xFF1A1A1A);
        }
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        MaterialCheckBox cbProduct;
        TextView         tvLabel;
        TextView         tvQtyUnit;
        ImageButton      btnEdit;
        ImageButton      btnDelete;
        View             dragHandle;

        ViewHolder(View v) {
            super(v);
            cbProduct  = v.findViewById(R.id.cbProduct);
            tvLabel    = v.findViewById(R.id.tvProductLabel);
            tvQtyUnit  = v.findViewById(R.id.tvProductQtyUnit);
            btnEdit    = v.findViewById(R.id.btnEditProduct);
            btnDelete  = v.findViewById(R.id.btnDeleteProduct);
            dragHandle = v.findViewById(R.id.dragHandle);
        }
    }
}
