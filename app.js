document.addEventListener("DOMContentLoaded", () => {
    // 1. Sidebar Toggle Logic for Mobile
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.getElementById('menuBtn');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');

    if (menuBtn && sidebar && closeSidebarBtn) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.add('open');
        });

        closeSidebarBtn.addEventListener('click', () => {
            sidebar.classList.remove('open');
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
                    sidebar.classList.remove('open');
                }
            }
        });
    }

    // 2. Chart.js Configurations
    
    // Custom Chart Defaults
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = '#64748B';
    Chart.defaults.scale.grid.color = '#E2E8F0';

    // Revenue Bar Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        new Chart(revenueCtx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Revenue (₹ Lakhs)',
                    data: [1.2, 1.5, 1.4, 1.8, 2.1, 2.5, 2.3, 2.8, 2.6, 3.0, 3.2, 3.5],
                    backgroundColor: '#2563EB',
                    borderRadius: 6,
                    borderSkipped: false,
                    barPercentage: 0.6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false // Hide legend for cleaner look
                    },
                    tooltip: {
                        backgroundColor: '#0F172A',
                        padding: 12,
                        titleFont: { size: 14, weight: '600' },
                        bodyFont: { size: 13 },
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `₹${context.parsed.y} Lakhs`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        border: { display: false },
                        ticks: {
                            callback: function(value) {
                                return '₹' + value + 'L';
                            }
                        }
                    },
                    x: {
                        border: { display: false },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    // Lead Conversion Doughnut Chart
    const conversionCtx = document.getElementById('conversionChart');
    if (conversionCtx) {
        new Chart(conversionCtx, {
            type: 'doughnut',
            data: {
                labels: ['Closed Deals', 'Negotiation', 'Proposal Sent', 'New Leads'],
                datasets: [{
                    data: [35, 20, 15, 30],
                    backgroundColor: [
                        '#10B981', // Success Green
                        '#F59E0B', // Warning Yellow
                        '#7C3AED', // Purple
                        '#2563EB'  // Primary Blue
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%', // Make the ring thinner
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: '#0F172A',
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return ` ${context.label}: ${context.parsed}%`;
                            }
                        }
                    }
                }
            }
        });
    }

    // 3. Task Checkbox Interactivity (Optional visual enhancement)
    const taskCheckboxes = document.querySelectorAll('.custom-checkbox input');
    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const taskText = this.closest('.task-info').querySelector('.task-text h4');
            if (this.checked) {
                // Already handled by CSS, but can add JS logic for completing tasks here
                console.log(`Task "${taskText.innerText}" completed!`);
            }
        });
    });
});

// ==========================
// Kanban Drag & Drop Logic
// ==========================

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    ev.target.classList.add('dragging');
}

function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const draggableElement = document.getElementById(data);
    
    // Remove dragging class
    draggableElement.classList.remove('dragging');
    
    // Allow dropping on the column body, not inside other cards
    if (ev.target.classList.contains('column-body')) {
        ev.target.appendChild(draggableElement);
        updateCardCounts();
    } else if (ev.target.closest('.kanban-card')) {
        const columnBody = ev.target.closest('.column-body');
        columnBody.insertBefore(draggableElement, ev.target.closest('.kanban-card'));
        updateCardCounts();
    }
}

function updateCardCounts() {
    const columns = document.querySelectorAll('.kanban-column');
    columns.forEach(column => {
        const count = column.querySelectorAll('.kanban-card').length;
        column.querySelector('.card-count').innerText = count;
    });
}

// Add event listener to remove dragging class if dropped outside
document.addEventListener('dragend', function(ev) {
    if (ev.target.classList.contains('kanban-card')) {
        ev.target.classList.remove('dragging');
    }
});
