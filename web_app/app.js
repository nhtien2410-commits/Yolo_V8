/**
 * ==========================================================================
 * AI SMART GREENHOUSE STRAWBERRY WEB DASHBOARD - APP CLIENT LOGIC
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // State
    let currentSelectedImage = null;
    let imagesList = [];

    // DOM Elements
    const modelStatusText = document.getElementById('model-status-text');
    const navStatusPill = document.getElementById('nav-status-pill');
    const heroPreviewImg = document.getElementById('hero-preview-img');

    // Live AI Diagnostic Elements
    const thumbnailGallery = document.getElementById('thumbnail-gallery');
    const imageCountBadge = document.getElementById('image-count-badge');
    const btnRunAI = document.getElementById('btn-run-ai');

    const imgOriginal = document.getElementById('img-original');
    const imgAnnotated = document.getElementById('img-annotated');
    const mainDiseaseBadge = document.getElementById('main-disease-badge');
    const resGridCoord = document.getElementById('res-grid-coord');
    const resSpotCount = document.getElementById('res-spot-count');
    const resConfidence = document.getElementById('res-confidence');
    const resAction = document.getElementById('res-action');
    const spotTableBody = document.getElementById('spot-table-body');

    // 2D Matrix Elements
    const btnScanAllRobot = document.getElementById('btn-scan-all-robot');
    const gridMatrix = document.getElementById('grid-matrix');
    const matrixTableBody = document.getElementById('matrix-table-body');

    // Pipeline Studio Elements
    const btnRunStage1Web = document.getElementById('btn-run-stage1-web');
    const pipelineLog1 = document.getElementById('pipeline-log-1');
    const toast = document.getElementById('toast');

    // ==========================================================================
    // 0. THREE.JS 3D HERO SPATIAL VISUALIZATION & PARALLAX
    // ==========================================================================
    function initHero3DScene() {
        const canvas = document.getElementById('hero-3d-canvas');
        if (!canvas || typeof THREE === 'undefined') return;

        // Skip 3D on reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const hero = document.getElementById('hero');
        if (!hero) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, hero.clientWidth / hero.clientHeight, 0.1, 100);
        camera.position.set(0, 0, 7);

        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({
                canvas: canvas,
                alpha: true,
                antialias: true,
                powerPreference: 'high-performance'
            });
            renderer.setSize(hero.clientWidth, hero.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        } catch (e) {
            console.warn('[3D] WebGL initialization skipped:', e);
            return;
        }

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0x00f2fe, 3, 20);
        pointLight1.position.set(5, 5, 5);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xef4444, 2.5, 20);
        pointLight2.position.set(-5, -3, 3);
        scene.add(pointLight2);

        // Group container for mouse parallax
        const mainGroup = new THREE.Group();
        scene.add(mainGroup);

        // 1. Procedural 3D Holographic Icosahedron Core (AI Brain)
        const icoGeometry = new THREE.IcosahedronGeometry(2.0, 1);
        const icoMaterial = new THREE.MeshStandardMaterial({
            color: 0x00f2fe,
            wireframe: true,
            transparent: true,
            opacity: 0.35,
            emissive: 0x00f2fe,
            emissiveIntensity: 0.4
        });
        const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
        mainGroup.add(icosahedron);

        // Inner Glowing Crystal Node
        const innerGeo = new THREE.IcosahedronGeometry(1.1, 0);
        const innerMat = new THREE.MeshStandardMaterial({
            color: 0xef4444,
            emissive: 0xef4444,
            emissiveIntensity: 0.6,
            roughness: 0.2,
            metalness: 0.8
        });
        const innerCrystal = new THREE.Mesh(innerGeo, innerMat);
        mainGroup.add(innerCrystal);

        // 2. Holographic LiDAR & Crop Coordinate Scanning Rings
        const ringGeo1 = new THREE.TorusGeometry(3.1, 0.02, 16, 64);
        const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.6 });
        const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
        ring1.rotation.x = Math.PI / 3;
        mainGroup.add(ring1);

        const ringGeo2 = new THREE.TorusGeometry(3.6, 0.02, 16, 64);
        const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.5 });
        const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
        ring2.rotation.y = Math.PI / 4;
        mainGroup.add(ring2);

        // 3. Floating Greenhouse Coordinate Particles (X, Y Grid Beacons)
        const particleCount = 140;
        const particleGeo = new THREE.BufferGeometry();
        const posArray = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            posArray[i] = (Math.random() - 0.5) * 16;
            posArray[i + 1] = (Math.random() - 0.5) * 10;
            posArray[i + 2] = (Math.random() - 0.5) * 12;
        }

        particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particleMat = new THREE.PointsMaterial({
            size: 0.08,
            color: 0x34d399,
            transparent: true,
            opacity: 0.75,
            blending: THREE.AdditiveBlending
        });
        const particles = new THREE.Points(particleGeo, particleMat);
        mainGroup.add(particles);

        // Mouse Parallax Lerping
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        });

        // Animation Loop with FPS throttling & visibility check
        let isVisible = true;
        const obs = new IntersectionObserver((entries) => {
            isVisible = entries[0].isIntersecting;
        }, { threshold: 0.1 });
        obs.observe(hero);

        let clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            if (!isVisible) return;

            const delta = clock.getDelta();
            const elapsed = clock.getElapsedTime();

            // Rotate core structures
            icosahedron.rotation.y += delta * 0.25;
            icosahedron.rotation.x += delta * 0.15;
            innerCrystal.rotation.y -= delta * 0.4;
            innerCrystal.rotation.z += delta * 0.2;

            ring1.rotation.z += delta * 0.3;
            ring2.rotation.x -= delta * 0.2;

            particles.rotation.y += delta * 0.05;

            // Smooth Mouse Parallax Lerp
            targetX += (mouseX * 0.6 - targetX) * 0.05;
            targetY += (mouseY * 0.4 - targetY) * 0.05;

            mainGroup.rotation.y = targetX + Math.sin(elapsed * 0.5) * 0.1;
            mainGroup.rotation.x = -targetY + Math.cos(elapsed * 0.4) * 0.08;

            renderer.render(scene, camera);
        }

        animate();

        // Responsive Resize
        window.addEventListener('resize', () => {
            if (!hero) return;
            camera.aspect = hero.clientWidth / hero.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(hero.clientWidth, hero.clientHeight);
        });
    }

    initHero3DScene();

    // ==========================================================================
    // 0.1. 3D TILT EFFECT ON LIVE ROBOT TELEMETRY CARD
    // ==========================================================================
    function initCard3DTilt() {
        const card = document.querySelector('.hero-card-glass');
        if (!card) return;

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // max 10 deg
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    }

    initCard3DTilt();

    // ==========================================================================
    // 1. SCROLL REVEAL & INTERSECTION OBSERVER ANIMATIONS
    // ==========================================================================
    const revealSections = document.querySelectorAll('section, .reveal-up, .stat-card, .dashboard-grid-2col, .grid-matrix-layout');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                entry.target.classList.add('reveal-on-scroll');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    });

    revealSections.forEach(el => {
        el.classList.add('reveal-on-scroll');
        revealObserver.observe(el);
    });

    // ==========================================================================
    // 2. HERO STATS ANIMATED NUMBER TICKER
    // ==========================================================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimatedStats = false;

    function animateStats() {
        if (hasAnimatedStats) return;
        hasAnimatedStats = true;

        statNumbers.forEach(stat => {
            const target = parseFloat(stat.dataset.target);
            const isPercent = stat.textContent.includes('%') || stat.dataset.target.includes('.');
            const duration = 1800; // ms
            const startTime = performance.now();

            function updateNumber(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // EaseOutQuad
                const easeProgress = 1 - (1 - progress) * (1 - progress);
                const current = (easeProgress * target).toFixed(target % 1 === 0 ? 0 : 1);

                stat.textContent = isPercent && !stat.textContent.includes('ms') ? `${current}%` : `${current}`;

                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                } else {
                    stat.textContent = target % 1 === 0 ? target : `${target}%`;
                }
            }

            requestAnimationFrame(updateNumber);
        });
    }

    const heroSection = document.getElementById('hero');
    if (heroSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateStats();
            }
        }, { threshold: 0.3 });
        statsObserver.observe(heroSection);
    }

    // ==========================================================================
    // 3. SYSTEM & MODEL STATUS CHECK
    // ==========================================================================
    async function checkSystemStatus() {
        try {
            const res = await fetch('/api/status');
            const data = await res.json();
            if (data.model_loaded) {
                const dupTxt = data.duplicate_images_count ? ` | Đã lọc ${data.duplicate_images_count} trùng` : '';
                modelStatusText.textContent = `YOLOv8 ONNX: Đã Sẵn Sàng (${data.captured_images_count} ảnh chuẩn${dupTxt})`;
                navStatusPill.className = 'system-status-pill';
            } else {
                modelStatusText.textContent = `YOLOv8: Đang tải weights...`;
            }
        } catch (e) {
            modelStatusText.textContent = 'Mất kết nối Server';
        }
    }

    // ==========================================================================
    // 4. LOAD & RENDER ROBOT CAPTURED IMAGES
    // ==========================================================================
    async function loadCapturedImages() {
        try {
            const res = await fetch('/api/captured_images');
            const data = await res.json();
            imagesList = data.images || [];
            if (data.total_duplicates && data.total_duplicates > 0) {
                imageCountBadge.textContent = `${imagesList.length} ảnh (Đã lọc ${data.total_duplicates} trùng)`;
                imageCountBadge.title = `Tổng ${data.total_raw} ảnh. Đã tự động lọc bỏ ${data.total_duplicates} ảnh trùng lặp MD5/dHash.`;
            } else {
                imageCountBadge.textContent = `${imagesList.length} ảnh`;
            }

            thumbnailGallery.innerHTML = '';
            if (imagesList.length === 0) {
                thumbnailGallery.innerHTML = '<div class="text-muted p-3">Chưa có ảnh trong captured_images/</div>';
                return;
            }

            imagesList.forEach((item, idx) => {
                const thumb = document.createElement('div');
                thumb.className = `thumb-item ${idx === 0 ? 'active' : ''}`;
                thumb.innerHTML = `
                    <img src="${item.url}" alt="${item.filename}">
                    <span class="thumb-label">${item.filename}</span>
                `;
                thumb.addEventListener('click', () => {
                    document.querySelectorAll('.thumb-item').forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                    selectImage(item.filename, item.url);
                });
                thumbnailGallery.appendChild(thumb);
            });

            // Set default active image
            if (imagesList.length > 0) {
                selectImage(imagesList[0].filename, imagesList[0].url);
            }
        } catch (e) {
            thumbnailGallery.innerHTML = '<div class="text-muted p-3">Lỗi nạp thư viện ảnh</div>';
        }
    }

    function selectImage(filename, url) {
        currentSelectedImage = filename;
        imgOriginal.src = url;
        imgOriginal.classList.remove('placeholder-img');
        imgAnnotated.src = url;
        imgAnnotated.classList.add('placeholder-img');

        if (heroPreviewImg) heroPreviewImg.src = url;

        mainDiseaseBadge.textContent = 'Sẵn Sàng Chẩn Đoán';
        mainDiseaseBadge.className = 'disease-pill pill-green';
        
        let coordStr = 'Tọa độ ô: X=?, Y=?';
        if (filename.includes('X') && filename.includes('Y')) {
            const parts = filename.split('_');
            let sideLabel = '';
            if (filename.includes('_L')) sideLabel = ' (Bên Trái)';
            else if (filename.includes('_R')) sideLabel = ' (Bên Phải)';
            coordStr = `Ô ${parts[0]} - ${parts[1]}${sideLabel}`;
        }
        resGridCoord.textContent = coordStr;
        resSpotCount.textContent = '--';
        resConfidence.textContent = '--%';
        resAction.textContent = 'Nhấn nút "Chạy AI Phân Tích Đốm Bệnh" bên dưới để quét đốm lá và quả.';
        spotTableBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Chưa chạy phân tích</td></tr>';
    }

    // ==========================================================================
    // 5. HD IMAGE ZOOM LIGHTBOX MODAL
    // ==========================================================================
    const zoomModal = document.getElementById('image-zoom-modal');
    const zoomModalImg = document.getElementById('zoom-modal-img');
    const zoomModalTitle = document.getElementById('zoom-modal-title');
    const zoomModalClose = document.getElementById('zoom-modal-close');
    const zoomModalBackdrop = document.getElementById('zoom-modal-backdrop');

    function openImageZoom(imgSrc, titleText) {
        if (!imgSrc || imgSrc.includes('placeholder') || imgSrc === window.location.href) {
            showToast('Chưa có ảnh để phóng to! Vui lòng chọn ảnh từ danh sách.');
            return;
        }
        zoomModalImg.src = imgSrc;
        zoomModalTitle.textContent = titleText || '🔎 Xem Ảnh Độ Phân Giải Cao (HD)';
        zoomModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeImageZoom() {
        zoomModal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    if (zoomModalClose) zoomModalClose.addEventListener('click', closeImageZoom);
    if (zoomModalBackdrop) zoomModalBackdrop.addEventListener('click', closeImageZoom);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && zoomModal && !zoomModal.classList.contains('hidden')) {
            closeImageZoom();
        }
    });

    const boxOriginal = document.getElementById('box-original');
    const boxAnnotated = document.getElementById('box-annotated');

    if (boxOriginal) {
        boxOriginal.addEventListener('click', () => {
            if (imgOriginal && imgOriginal.src) {
                openImageZoom(imgOriginal.src, `📸 Ảnh Gốc Từ Robot: ${currentSelectedImage || ''}`);
            }
        });
    }

    if (boxAnnotated) {
        boxAnnotated.addEventListener('click', () => {
            if (imgAnnotated && imgAnnotated.src) {
                openImageZoom(imgAnnotated.src, `🎯 Kết Quả Phân Tích Bounding Box AI: ${currentSelectedImage || ''}`);
            }
        });
    }

    // ==========================================================================
    // 6. RUN AI DIAGNOSTIC
    // ==========================================================================
    btnRunAI.addEventListener('click', async () => {
        if (!currentSelectedImage) {
            showToast('Vui lòng chọn hoặc tải lên 1 ảnh dâu tây!');
            return;
        }

        btnRunAI.disabled = true;
        btnRunAI.innerHTML = '<span class="spinner"></span> <span>Đang suy luận YOLOv8 ONNX...</span>';

        try {
            const res = await fetch('/api/infer_image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename: currentSelectedImage })
            });
            const data = await res.json();

            if (!data.success) {
                showToast(`Lỗi: ${data.error || 'Không thể suy luận'}`);
                return;
            }

            // Hiển thị ảnh đã vẽ Bounding Box
            imgAnnotated.src = data.annotated_image_url + '?t=' + Date.now();
            imgAnnotated.classList.remove('placeholder-img');

            // Cập nhật thẻ kết quả
            const pKey = data.primary_disease;
            mainDiseaseBadge.textContent = data.primary_disease_name;
            mainDiseaseBadge.className = `disease-pill pill-${getDiseaseColorClass(pKey)}`;

            resGridCoord.textContent = `Ô (X = ${data.grid_x}, Y = ${data.grid_y})`;
            resSpotCount.textContent = `${data.detections_count} đốm bệnh`;
            resConfidence.textContent = `${data.confidence}%`;
            resAction.textContent = data.action;

            // Cập nhật bảng chi tiết Bounding Box
            spotTableBody.innerHTML = '';
            if (data.detections.length === 0) {
                spotTableBody.innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center text-green font-bold">
                            🌿 Cây dâu tây khỏe mạnh / Không phát hiện đốm bệnh nguy hại
                        </td>
                    </tr>
                `;
            } else {
                data.detections.forEach((spot, idx) => {
                    const row = document.createElement('tr');
                    const b = spot.box_pixel;
                    row.innerHTML = `
                        <td>${idx + 1}</td>
                        <td><span class="badge badge-${getDiseaseColorClass(spot.class_key)}">${spot.class_name}</span></td>
                        <td class="font-bold text-green">${spot.confidence}%</td>
                        <td>[X1: ${b[0]}, Y1: ${b[1]}, X2: ${b[2]}, Y2: ${b[3]}]</td>
                        <td>(${spot.center_norm[0]}, ${spot.center_norm[1]})</td>
                    `;
                    spotTableBody.appendChild(row);
                });
            }

            showToast(`Chẩn đoán hoàn tất: ${data.primary_disease_name} (${data.confidence}%)`);

        } catch (e) {
            showToast('Lỗi kết nối máy chủ AI');
        } finally {
            btnRunAI.disabled = false;
            btnRunAI.innerHTML = '<span class="btn-icon">⚡</span><span>Chạy AI Phân Tích Đốm Bệnh (1-Click)</span>';
        }
    });

    function getDiseaseColorClass(key) {
        switch (key) {
            case 'khoe_manh': return 'green';
            case 'dom_trang': return 'white';
            case 'vang_ua': return 'yellow';
            case 'kho_heo': return 'orange';
            case 'chay_la': return 'red';
            default: return 'green';
        }
    }

    // ==========================================================================
    // 7. 2D GREENHOUSE SPRAY MATRIX & BATCH SCAN
    // ==========================================================================
    btnScanAllRobot.addEventListener('click', async () => {
        btnScanAllRobot.disabled = true;
        btnScanAllRobot.innerHTML = '<span class="spinner"></span> <span>Đang quét toàn bộ ảnh robot...</span>';

        try {
            const res = await fetch('/api/scan_all_robot_images', { method: 'POST' });
            const data = await res.json();

            if (data.success) {
                renderGridMatrix(data.grid_cells);
                renderCSVTable(data.grid_cells);
                showToast(`Đã quét xong ${data.total_scanned} ảnh và tạo bản đồ điều phối phun thuốc!`);
            } else {
                showToast(`Lỗi: ${data.error}`);
            }
        } catch (e) {
            showToast('Lỗi quét hàng loạt');
        } finally {
            btnScanAllRobot.disabled = false;
            btnScanAllRobot.innerHTML = '<span class="btn-icon">🚜</span><span>Quét Toàn Bộ Lượt Chạy Của Robot</span>';
        }
    });

    async function loadSprayMatrix() {
        try {
            const res = await fetch('/api/spray_matrix');
            const data = await res.json();
            if (data.grid_cells && data.grid_cells.length > 0) {
                renderGridMatrix(data.grid_cells);
                renderCSVTable(data.grid_cells);
            }
        } catch (e) {}
    }

    function renderGridMatrix(cells) {
        gridMatrix.innerHTML = '';
        
        // 4 Cột: Cột 1 (X=1 Tây), Cột 2 (X=2 Giữa-Trái), Cột 3 (X=2 Giữa-Phải), Cột 4 (X=3 Đông)
        // 3 Hàng: Y=3 (Trên), Y=2 (Giữa), Y=1 (Dưới) -> Tổng cộng 12 Ô Cây Dâu Tây
        // Đánh số cây: Từ dưới lên trên (Y=1 -> Y=2 -> Y=3) và từ trái sang phải (Cột 1 -> 2 -> 3 -> 4)
        const cellMap = {};
        cells.forEach(c => { 
            const col = c.col_idx || (((c.tree_id - 1) / 3 | 0) + 1);
            cellMap[`${col}_${c.y}`] = c; 
        });

        for (let y = 3; y >= 1; y--) { // Vẽ từ Hàng 3 (Bắc) xuống Hàng 1 (Nam)
            for (let col = 1; col <= 4; col++) {
                const key = `${col}_${y}`;
                const expectedTreeId = (col - 1) * 3 + y; // Y=1 -> tree 1,4,7,10; Y=2 -> tree 2,5,8,11; Y=3 -> tree 3,6,9,12
                const expectedX = (col === 1) ? 1 : (col === 4 ? 3 : 2);
                const data = cellMap[key] || { 
                    tree_id: expectedTreeId,
                    col_idx: col,
                    x: expectedX, 
                    y: y, 
                    wing: col === 1 ? 'Tây Ngoài' : (col === 2 ? 'Cánh Trái' : (col === 3 ? 'Cánh Phải' : 'Đông Ngoài')),
                    disease_key: 'khoe_manh', 
                    disease_name: 'Khỏe mạnh', 
                    confidence: 92.0, 
                    action: 'Không cần can thiệp' 
                };

                const cellElem = document.createElement('div');
                cellElem.className = `matrix-cell bg-${getDiseaseColorClass(data.disease_key)}`;
                cellElem.innerHTML = `
                    <span class="coord-label">Cây #${data.tree_id || expectedTreeId} (X = ${data.x}, Y = ${data.y})</span>
                    <span class="status-name">${data.disease_name}</span>
                    <span class="conf-score font-bold text-green">${data.confidence}% tin cậy</span>
                    <span class="text-xs text-muted" style="font-size: 0.7rem; opacity: 0.85;">${data.wing || ''}</span>
                `;
                cellElem.addEventListener('click', () => {
                    showToast(`Cây #${data.tree_id || expectedTreeId} (Ô X=${data.x}, Y=${data.y}): ${data.disease_name} [${data.confidence}%] → ${data.action}`);
                });
                gridMatrix.appendChild(cellElem);
            }
        }
    }

    function renderCSVTable(cells) {
        matrixTableBody.innerHTML = '';
        cells.forEach((c, idx) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="font-bold text-center">#${c.tree_id || idx + 1}</td>
                <td class="font-bold text-accent">Ô (X = ${c.x}, Y = ${c.y})</td>
                <td><span class="text-sm font-semibold">${c.pos_name || c.aisle || (c.wing ? `Lối ${c.wing}` : '')}</span></td>
                <td><span class="badge badge-${getDiseaseColorClass(c.disease_key)}">${c.disease_name}</span></td>
                <td class="font-bold text-green">${c.confidence}%</td>
                <td>${c.action}</td>
            `;
            matrixTableBody.appendChild(row);
        });
    }

    // ==========================================================================
    // 8. STAGE 1 1-CLICK PIPELINE EXECUTION
    // ==========================================================================
    btnRunStage1Web.addEventListener('click', async () => {
        btnRunStage1Web.disabled = true;
        pipelineLog1.textContent = 'Đang chạy Tiền xử lý & Chia tập dữ liệu 70/15/15...';

        try {
            const res = await fetch('/api/run_pipeline_stage1', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                pipelineLog1.textContent = '✅ Hoàn tất 100%! File dataset.zip đã sẵn sàng.';
                showToast('Giai đoạn 1 đã thực hiện thành công!');
            } else {
                pipelineLog1.textContent = `❌ Lỗi: ${data.error}`;
            }
        } catch (e) {
            pipelineLog1.textContent = '❌ Lỗi kết nối máy chủ';
        } finally {
            btnRunStage1Web.disabled = false;
        }
    });

    // ==========================================================================
    // 9. ACTIVE NAV LINK ON SCROLL
    // ==========================================================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================================================
    // 10. TOAST NOTIFICATION HELPER
    // ==========================================================================
    function showToast(msg) {
        toast.textContent = msg;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 4000);
    }

    // ==========================================================================
    // 11. PWA SERVICE WORKER & 1-CLICK APP INSTALL HANDLER
    // ==========================================================================
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
            for (let registration of registrations) {
                registration.update();
            }
        });
        navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW reg error:', err));
    }

    let deferredPrompt = null;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        const btnInstall = document.getElementById('btn-install-pwa');
        if (btnInstall) {
            btnInstall.style.display = 'inline-flex';
            btnInstall.onclick = async () => {
                btnInstall.style.display = 'none';
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    deferredPrompt = null;
                }
            };
        }
    });

    // Initial load
    checkSystemStatus();
    loadCapturedImages();
    loadSprayMatrix();
});
