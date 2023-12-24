 // هذه التابع تقوم باضافة منتج الى سلة المشتريات
 function addToCart(product, price) {
    // الحصول على جدول عناصر سلة المشتريات
    var cartItems = document.getElementById("cart-items");
    // البحث عن المنتج في الجدول
    var found = false;
    for (var i = 1; i < cartItems.rows.length; i++) {
        var row = cartItems.rows[i];
        var item = row.cells[1].innerHTML;
        if (item == product) {
            // اذا وجد المنتج، زيادة الكمية بواحد
            var quantity = parseInt(row.cells[3].innerHTML);
            quantity++;
            row.cells[3].innerHTML = quantity;
            // اعادة حساب السعر الاجمالي للمنتج
            var total = quantity * price;
            row.cells[4].innerHTML = total;
            found = true;
            break;
        }
    }
    if (!found) {
        // اذا لم يوجد المنتج، اضافة صف جديد في الجدول
        var index = cartItems.rows.length;
        var row = cartItems.insertRow(index);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        cell1.innerHTML = index;
        cell2.innerHTML = product;
        cell3.innerHTML = price;
        cell4.innerHTML = 1;
        cell5.innerHTML = price;
    }
    // اعادة حساب الضريبة والمجموع النهائي
    calculateTotal();
}

// هذه التابع تقوم بالغاء الطلب وافراغ سلة المشتريات
function cancelOrder() {
    // الحصول على جدول عناصر سلة المشتريات
    var cartItems = document.getElementById("cart-items");
    // حذف جميع الصفوف ما عدا الصف الاول
    while (cartItems.rows.length > 1) {
        cartItems.deleteRow(1);
    }
    // اعادة حساب الضريبة والمجموع النهائي
    calculateTotal();
}

// هذه التابع تقوم بمتابعة الطلب واظهار نموذج الطلب
function proceedOrder() {
    // الحصول على عنصر نموذج الطلب
    var form = document.getElementById("form");
    // تغيير خاصية العرض لاظهار النموذج
    form.style.display = "block";
}

// هذه التابع تقوم بالتحقق من صحة المدخلات في نموذج الطلب
function validateForm() {
    // الحصول على قيم المدخلات
    var name = document.getElementById("name").value;
    var id = document.getElementById("id").value;
    var date = document.getElementById("date").value;
    var phone = document.getElementById("phone").value;
    var email = document.getElementById("email").value;
    var captcha = document.getElementById("captcha").value;
    // الحصول على قيمة الرمز captcha الحقيقية
    var captchaValue = document.getElementById("captcha-image").alt;
    // انشاء متغير للتحقق من الصحة
    var valid = true;
    // التحقق من الاسم اذا كان يحتوي على احرف هجائية فقط باللغة العربية
    var namePattern = /^[أ-ي\s]+$/;
    if (!namePattern.test(name)) {
        alert("الاسم يجب أن يحتوي على أحرف هجائية فقط باللغة العربية");
        valid = false;
    }
    // التحقق من الرقم الوطني اذا كان يحتوي على 11 خانة والخانتين الاوليتين ترمزان الى المحافظة
    var idPattern = /^(01|02|03|04|05|06|07|08|09|10|11|12|13|14)\d{9}$/;
    if (!idPattern.test(id)) {
        alert("الرقم الوطني يجب أن يحتوي على 11 خانة والخانتين الاوليتين ترمزان الى المحافظة");
        valid = false;
    }
    // التحقق من تاريخ الولادة اذا كان يأخذ الشكل dd-mm-yyyy
    var datePattern = /^\d{2}-\d{2}-\d{4}$/;
    if (!datePattern.test(date)) {
        alert("تاريخ الولادة يجب أن يأخذ الشكل dd-mm-yyyy");
        valid = false;
    }
    // التحقق من رقم الموبايل اذا كان يطابق أرقام شبكتي Syriatel و MTN
    var phonePattern = /^(09|094|095)\d{7}$/;
    if (!phonePattern.test(phone)) {
        alert("رقم الموبايل يجب أن يطابق أرقام شبكتي Syriatel و MTN");
        valid = false;
    }
    // التحقق من الايميل اذا كان يحتوي على @ و .
    var emailPattern = /@.*\./;
    if (!emailPattern.test(email)) {
        alert("الايميل يجب أن يحتوي على @ و .");
        valid = false;
    }
    // التحقق من الرمز captcha اذا كان يطابق الرمز الحقيقي
    if (captcha != captchaValue) {
        alert("الرمز captcha غير صحيح");
        valid = false;
    }

   // اذا كانت جميع المدخلات صحيحة، اظهار نافذة جديدة تتضمن المجموع النهائي
   if (valid) {
    var total = document.getElementById("total").innerHTML;
    alert("شكراً لك على طلبك. المجموع النهائي هو: " + total);
}
// ارجاع قيمة الصحة
return valid;
}


// هذه التابع تقوم بحساب الضريبة والمجموع النهائي لسلة المشتريات
function calculateTotal() {
    // الحصول على جدول عناصر سلة المشتريات
    var cartItems = document.getElementById("cart-items");
    // انشاء متغيرات لتخزين القيم
    var subtotal = 0;
    var tax = 0;
    var total = 0;
    // حلقة لتكرار على كل صف في الجدول
    for (var i = 1; i < cartItems.rows.length; i++) {
        var row = cartItems.rows[i];
        // جمع السعر الاجمالي لكل منتج
        subtotal += parseInt(row.cells[4].innerHTML);
    }
    // حساب الضريبة بنسبة 5%
    tax = subtotal * 0.05;
    // حساب المجموع النهائي
    total = subtotal + tax;
    // الحصول على عناصر العرض
    var subtotalDisplay = document.getElementById("subtotal");
    var taxDisplay = document.getElementById("tax");
    var totalDisplay = document.getElementById("total");
    // تحديث قيم العرض
    subtotalDisplay.innerHTML = subtotal + " ل.س";
    taxDisplay.innerHTML = tax + " ل.س";
    totalDisplay.innerHTML = total + " ل.س";
}

function showForm() {
    document.getElementById("purchaseForm").style.display = "block";
    generateCaptcha();
}

function validateForm() {
    var captchaInput = document.getElementById("captcha").value;
    // قم بتنفيذ الكود الخاص بالتحقق من صحة رمز Captcha هنا

    // إظهار نافذة تأكيد
    var confirmation = confirm("تأكيد عملية الشراء؟");

    if (confirmation) {
        alert("تمت عملية الشراء بنجاح!");
        return true;
    } else {
        alert("تم إلغاء عملية الشراء.");
        return false;
    }
}

function generateCaptcha() {
    var captchaText = generateRandomString(6);
    document.getElementById("captcha").value = "";
    document.getElementById("captcha").placeholder = captchaText;
    document.getElementById("captchaImage").src = "https://dummyimage.com/150x50/000/fff&text=" + captchaText;
}

function generateRandomString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function changeCaptcha() {
    generateCaptcha();
}

